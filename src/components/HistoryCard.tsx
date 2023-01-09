import { Heading, HStack, Text, VStack } from "native-base";

interface HistoryCard {
  exercise: string;
  group: string;
  hour: string;
}

export function HistoryCard({ exercise, group, hour }: HistoryCard) {
  return (
    <HStack
      w="full"
      px={5}
      py={4}
      mb={3}
      bg="gray.600"
      rounded="md"
      alignItems="center"
      justifyContent="space-between"
    >
      <VStack mr={5}>
        <Heading
          color="white"
          fontSize="md"
          fontFamily="heading"
          textTransform="capitalize"
        >
          {group}
        </Heading>
        <Text color="gray.100" fontSize="lg" numberOfLines={1}>
          {exercise}
        </Text>
      </VStack>

      <Text color="gray.300" fontSize="md">
        {hour}
      </Text>
    </HStack>
  );
}
