import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { ScreenHeader } from "@components/ScreenHeader";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Avatar, Box, FlatList, HStack, Icon, Text, VStack } from "native-base";
import { Entypo } from "@expo/vector-icons";

import { Button } from "@components/Button";
import defaultUserPhotoImg from "@assets/userPhotoDefault.png";
import { useStudent } from "@hooks/useStudent";
import { StudentDTO } from "@dtos/StudentDTO";
import { Loading } from "@components/Loading";
import { useToast } from "@hooks/useToast";
import { api } from "@services/api";
import { AdmStackNavigatorRoutesProps } from "@routes/admin.stack.routes";

export function AdmStudent() {
  const [students, setStudents] = useState<StudentDTO[]>([]);
  const [isLoadingGetAllStudents, setIsLoadingGetAllStudents] = useState(true);

  const isFocused = useIsFocused();
  const { getAllStudent } = useStudent();
  const navigation = useNavigation<AdmStackNavigatorRoutesProps>();
  const { handleError } = useToast();

  async function initialLoading() {
    try {
      const studentsList = await getAllStudent();
      setStudents(studentsList);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoadingGetAllStudents(false);
    }
  }

  useEffect(() => {
    initialLoading();
  }, [isFocused]);

  function handleOpenStudentProfile(studentId: string) {
    navigation.navigate("studentProfile", {
      studentId,
    });
  }

  function handleNewStudent() {
    navigation.navigate("studentProfile", {});
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Meus alunos" />

      {isLoadingGetAllStudents ? (
        <Loading />
      ) : (
        <>
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
                      justifyContent="space-between"
                      
                      p={4}
                      bg="gray.500"
                      borderRadius="md"
                    >
                      <HStack space={4}>
                        <Avatar
                          source={
                            item.photo_url
                              ? {
                                  uri: `${api.defaults.baseURL}/avatar/${item.photo_url}`,
                                }
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

                      <Icon
                        as={Entypo}
                        name="chevron-thin-right"
                        color="gray.300"
                      />
                    </HStack>
                  </TouchableOpacity>
                );
              }}
            />
          </VStack>
          <VStack px={4} pt={2} pb={6}>
            <Button title="Novo Aluno" onPress={handleNewStudent} />
          </VStack>
        </>
      )}
    </VStack>
  );
}
