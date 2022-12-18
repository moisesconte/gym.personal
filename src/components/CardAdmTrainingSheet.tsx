import { Box, Flex, Text } from "native-base";
import { TouchableOpacity } from "react-native";

interface CardTrainingSheetProps {
  name: string;
  createAtFormatted: string;
  isActive: boolean;
  onPress?: () => void;
}

export function CardTrainingSheet({
  name,
  createAtFormatted,
  isActive,
  onPress,
}: CardTrainingSheetProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Box p={4} bg="gray.500" borderRadius="md" w="full">
        <Text color="gray.100" fontSize="lg">
          {name}
        </Text>
        <Flex direction="row" justify="space-between">
          <Text color="gray.300" fontSize="md">
            Criado em {createAtFormatted}
          </Text>
          <Text color={isActive ? "green.500" : "red.500"}>
            {isActive ? "Ficha Ativa" : "Ficha Inativa"}
          </Text>
        </Flex>
      </Box>
    </TouchableOpacity>
  );
}
