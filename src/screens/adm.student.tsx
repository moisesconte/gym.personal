import { ScreenHeader } from "@components/ScreenHeader";
import { Avatar, Box, FlatList, HStack, Text, VStack } from "native-base";

import defaultUserPhotoImg from "@assets/userPhotoDefault.png";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AdmNavigatorRoutesProps } from "@routes/admin.routes";
import { Button } from "@components/Button";

const students = [
  {
    id: 1,
    name: "Aluno 01",
    photo_url: undefined,
    email: "aluno@email.com",
  },
  {
    id: 2,
    name: "Aluno 02",
    photo_url: undefined,
    email: "aluno02@email.com",
  },
  {
    id: 3,
    name: "Aluno 03",
    photo_url: undefined,
    email: "aluno03@email.com",
  },
  {
    id: 4,
    name: "Aluno 04",
    photo_url: undefined,
    email: "aluno04@email.com",
  },
  {
    id: 5,
    name: "Aluno 05",
    photo_url: undefined,
    email: "aluno05@email.com",
  },
  {
    id: 6,
    name: "Aluno 06",
    photo_url: undefined,
    email: "aluno06@email.com",
  },
  {
    id: 7,
    name: "Aluno 07",
    photo_url: undefined,
    email: "aluno07@email.com",
  },
  {
    id: 8,
    name: "Aluno 08",
    photo_url: undefined,
    email: "aluno08@email.com",
  },
  {
    id: 9,
    name: "Aluno 09",
    photo_url: undefined,
    email: "aluno09@email.com",
  },
  {
    id: 10,
    name: "Aluno 10",
    photo_url: undefined,
    email: "aluno10@email.com",
  },
];

export function AdmStudent() {
  const navigation = useNavigation<AdmNavigatorRoutesProps>();

  function handleOpenStudentProfile(studentId: number) {
    navigation.navigate("studentProfile");
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Meus alunos" />

      <VStack p="4" flex={1}>
        <FlatList
          data={students}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <Box h={4} w="full" />}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => handleOpenStudentProfile(item.id)}
              >
                <HStack
                  alignItems="center"
                  space={4}
                  p={4}
                  bg="gray.500"
                  borderRadius="md"
                >
                  <Avatar
                    source={
                      item.photo_url
                        ? { uri: item.photo_url }
                        : defaultUserPhotoImg
                    }
                  />
                  <VStack>
                    <Text color="gray.200" fontSize="lg">
                      {item.name}
                    </Text>
                    <Text color="gray.300" fontSize="sm">
                      {item.email}
                    </Text>
                  </VStack>
                </HStack>
              </TouchableOpacity>
            );
          }}
        />
      </VStack>
      <VStack px={4} pt={2} pb={6}>
        <Button title="Novo Aluno" />
      </VStack>
    </VStack>
  );
}
