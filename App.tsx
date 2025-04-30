import { GluestackUIProvider } from "@gluestack-ui/themed";
import { StatusBar } from "react-native";
import { config } from "./config/gluestack-ui.config";
import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { Loader } from "@components/Loader";
import { Routes } from "@routes/index";
import { AuthContextProvider } from "@contexts/AuthContext";

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  return (
    <GluestackUIProvider config={config}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <AuthContextProvider>
        {fontsLoaded ? <Routes /> : <Loader />}
      </AuthContextProvider>
    </GluestackUIProvider>
  );
}
