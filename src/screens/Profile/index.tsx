import { Alert, ScrollView, TouchableOpacity } from "react-native";
import { Center, Heading, Text, VStack } from "@gluestack-ui/themed";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { useState } from "react";

const PHOTO_CONFIG = {
  MAX_SIZE_MB: 5,
  ASPECT_RATIO: [4, 4],
  QUALITY: 1,
};

const ERROR_MESSAGES = {
  SIZE_EXCEEDED: `Image size exceeds ${PHOTO_CONFIG.MAX_SIZE_MB}MB limit. Please choose a smaller image.`,
  GENERAL_ERROR: "Unable to update profile photo. Please try again.",
};

export function Profile() {
  const [userPhoto, setUserPhoto] = useState("https://github.com/dclleite.png");

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
      Alert.alert("Error", ERROR_MESSAGES.GENERAL_ERROR);
    }
  }

  async function validateAndUpdatePhoto(photoUri: string): Promise<void> {
    const photoInfo = await FileSystem.getInfoAsync(photoUri);

    if (!photoInfo.exists) {
      throw new Error("Photo file not found");
    }

    console.log("Photo info:", photoInfo);
    const sizeInMB = photoInfo.size / 1024 / 1024;
    if (sizeInMB > PHOTO_CONFIG.MAX_SIZE_MB) {
      Alert.alert("Error", ERROR_MESSAGES.SIZE_EXCEEDED);
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
            <Input placeholder="Name" bg="$gray600" />
            <Input value="eduardoc.leitte@gmail.com" bg="$gray600" isReadOnly />
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
            <Input
              placeholder="Current Password"
              bg="$gray600"
              secureTextEntry
            />
            <Input placeholder="New Password" bg="$gray600" secureTextEntry />
            <Input
              placeholder="Confirm New Password"
              bg="$gray600"
              secureTextEntry
            />

            <Button title="Update" />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  );
}
