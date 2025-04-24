import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { Heading, Text, VStack } from "@gluestack-ui/themed";
import { useState } from "react";
import { SectionList } from "react-native";

export function History() {
  const [exercises, setExercises] = useState([
    {
      title: "07/22/24",
      data: ["Front pull", "Single-arm row"],
    },
    {
      title: "07/23/24",
      data: ["Front pull"],
    },
  ]);
  return (
    <VStack flex={1}>
      <ScreenHeader title="History" />
      <SectionList
        sections={exercises}
        keyExtractor={(item) => item}
        renderItem={() => <HistoryCard />}
        renderSectionHeader={({ section }) => (
          <Heading color="$gray200" fontSize="$md" mt="$10" mb="$3">
            {section.title}
          </Heading>
        )}
        style={{ paddingHorizontal: 32 }}
        contentContainerStyle={
          exercises.length === 0 && { flex: 1, justifyContent: "center" }
        }
        ListEmptyComponent={() => (
          <Text color="$gray200" textAlign="center">
            No exercises registered yet. {"\n"}
            Let's workout today?
          </Text>
        )}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  );
}
