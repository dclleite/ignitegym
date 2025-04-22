import {
  Center,
  Heading,
  Image,
  ScrollView,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";

import BackgroundImg from "@assets/background.png";
import Logo from "@assets/logo.svg";

import { Input } from "@components/Input";
import { Button } from "@components/Button";

import { AuthNavigatorRoutesProps } from "@routes/auth.routes";

export function SignIn() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  function handleNewAccount() {
    navigation.navigate("signUp");
  }
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      automaticallyAdjustKeyboardInsets
    >
      <VStack flex={1}>
        <Image
          w="$full"
          h={624}
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="People training"
          position="absolute"
        />

        <VStack flex={1} px="$10" pb="$16">
          <Center my="$24">
            <Logo />

            <Text color="$gray100" fontSize="$sm">
              Train your mind and body
            </Text>
          </Center>

          <Center gap="$2">
            <Heading color="$gray100">Access your account</Heading>

            <Input
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input placeholder="Password" secureTextEntry />

            <Button title="Access" />
          </Center>
          <Center flex={1} justifyContent="flex-end" marginTop="$4">
            <Text color="$gray100" fontSize="$sm" mb="$3" fontFamily="$body">
              Don't have an account?
            </Text>

            <Button
              onPress={handleNewAccount}
              title="Create account"
              variant="outline"
            />
          </Center>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
