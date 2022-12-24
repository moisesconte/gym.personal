import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Heading, HStack, Image, Text, VStack, Icon } from "native-base";
import { Entypo } from "@expo/vector-icons";
import { api } from "@services/api";

type Props = TouchableOpacityProps & {
  name: string;
  series: string;
  repetitions: string;
  thumb: string;
};

export function ExerciseCard({
  name,
  series,
  repetitions,
  thumb,
  ...rest
}: Props) {
  return (
    <TouchableOpacity {...rest}>
      <HStack
        bg="gray.500"
        alignItems="center"
        p={2}
        pr={4}
        rounded="md"
        mb={3}
      >
        <Image
          source={{
            uri: `${api.defaults.baseURL}/exercise-thumb/${thumb}`,
          }}
          alt="Imagem do exercício"
          w={16}
          h={16}
          rounded="md"
          mr={4}
          resizeMode="center"
        />

        <VStack flex={1}>
          <Heading fontSize="lg" fontFamily="heading" color="white">
            {name}
          </Heading>
          <Text fontSize="sm" color="gray.200" mt={1} numberOfLines={2}>
            {`${series} séries x ${repetitions} repetições`}
          </Text>
        </VStack>

        <Icon as={Entypo} name="chevron-thin-right" color="gray.300" />
      </HStack>
    </TouchableOpacity>
  );
}
