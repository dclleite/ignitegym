import { Center, Spinner } from "@gluestack-ui/themed";

export function Loader() {
  return (
    <Center flex={1} bg="$gray700">
      <Spinner color="$green500" />
    </Center>
  );
}
