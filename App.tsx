import { GluestackUIProvider, Text } from "@gluestack-ui/themed";
import { StatusBar } from "react-native";
import { config } from "./config/gluestack-ui.config";

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Text color="$gray500">Home</Text>
    </GluestackUIProvider>
  );
}
