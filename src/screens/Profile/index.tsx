import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Center, Heading, Text, VStack } from "@gluestack-ui/themed";
import { ScrollView, TouchableOpacity } from "react-native";

export function Profile() {
  return (
    <VStack flex={1}>
      <ScreenHeader title="Profile" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto
            source={{ uri: "https://github.com/dclleite.png" }}
            size="xl"
            alt="User image"
          />

          <TouchableOpacity>
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
