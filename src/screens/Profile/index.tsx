import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, TouchableOpacity } from "react-native";
import { Center, Heading, Text, useToast, VStack } from "@gluestack-ui/themed";

import * as yup from "yup";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

import { useAuth } from "@hooks/useAuth";
import { yupResolver } from "@hookform/resolvers/yup";

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { UserPhoto } from "@components/UserPhoto";
import { ScreenHeader } from "@components/ScreenHeader";
import { ToastMessage } from "@components/ToastMessage";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";

const PHOTO_CONFIG = {
  MAX_SIZE_MB: 5,
  ASPECT_RATIO: [4, 4],
  QUALITY: 1,
};

const ERROR_MESSAGES = {
  SIZE_EXCEEDED: `Image size exceeds ${PHOTO_CONFIG.MAX_SIZE_MB}MB limit. Please choose a smaller image.`,
  GENERAL_ERROR: "Unable to update profile photo. Please try again.",
};

const profileSchema = yup.object({
  name: yup.string().required("Please enter your name."),
  email: yup.string().required("Please enter your email.").email(),
  old_password: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .optional()
    .default(null),
  password: yup
    .string()
    .min(6, "The password must be at least 6 characters long.")
    .nullable()
    .transform((value) => (!!value ? value : null))
    .default(null),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .oneOf(
      [yup.ref("password"), ""],
      "The password confirmation does not match."
    )
    .default(null),
});

type FormDataProps = yup.InferType<typeof profileSchema>;

export function Profile() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [userPhoto, setUserPhoto] = useState("https://github.com/dclleite.png");

  const toast = useToast();
  const { user, updateUserProfile } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema),
  });

  async function handleUserPhotoSelect(): Promise<void> {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        quality: PHOTO_CONFIG.QUALITY,
        aspect: PHOTO_CONFIG.ASPECT_RATIO as [number, number],
        allowsEditing: true,
      });

      if (photoSelected.canceled || !photoSelected.assets?.[0]?.uri) {
        return;
      }

      const photoUri = photoSelected.assets[0].uri;
      await validateAndUpdatePhoto(photoUri);
    } catch (error) {
      console.error("[handleUserPhotoSelect]:", error);
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title="Error"
            description={ERROR_MESSAGES.GENERAL_ERROR}
            action="error"
            onClose={() => toast.close(id)}
          />
        ),
      });
    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setIsUpdating(true);

      const userUpdated = user;
      userUpdated.name = data.name;

      await api.put("/users", data);

      await updateUserProfile(userUpdated);

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title="Profile updated successfully!"
            action="success"
          />
        ),
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Unable to update your profile. Please try again later.";

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage id={id} title={title} action="error" />
        ),
      });
    } finally {
      setIsUpdating(false);
    }
  }

  async function validateAndUpdatePhoto(photoUri: string): Promise<void> {
    const photoInfo = await FileSystem.getInfoAsync(photoUri);

    if (!photoInfo.exists) {
      throw new Error("Photo file not found");
    }

    const sizeInMB = photoInfo.size / 1024 / 1024;
    if (sizeInMB > PHOTO_CONFIG.MAX_SIZE_MB) {
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title="Error"
            description={ERROR_MESSAGES.SIZE_EXCEEDED}
            action="error"
            onClose={() => toast.close(id)}
          />
        ),
      });
      return;
    }

    setUserPhoto(photoUri);
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Profile" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto source={{ uri: userPhoto }} size="xl" alt="User image" />

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color="$green500"
              fontFamily="$heading"
              fontSize="$md"
              mt="$2"
              mb="$8"
            >
              Change Profile Photo
            </Text>
          </TouchableOpacity>
          <Center w="$full" gap="$4">
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => (
                <Input
                  bg="$gray600"
                  placeholder="Name"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.name?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <Input
                  bg="$gray600"
                  placeholder="Email"
                  isReadOnly
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </Center>
          <Heading
            alignSelf="flex-start"
            fontFamily="$heading"
            color="$gray200"
            fontSize="$md"
            mt="$12"
            mb="$2"
          >
            Change Password
          </Heading>

          <Center w="$full" gap="$4">
            <Controller
              control={control}
              name="old_password"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Current Password"
                  bg="$gray600"
                  secureTextEntry
                  onChangeText={onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="New Password"
                  bg="$gray600"
                  secureTextEntry
                  onChangeText={onChange}
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="confirm_password"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Confirm New Password"
                  bg="$gray600"
                  secureTextEntry
                  onChangeText={onChange}
                  errorMessage={errors.confirm_password?.message}
                />
              )}
            />

            <Button
              title="Update"
              onPress={handleSubmit(handleProfileUpdate)}
              isLoading={isUpdating}
            />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  );
}
