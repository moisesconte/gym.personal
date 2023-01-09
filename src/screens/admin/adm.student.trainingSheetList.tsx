import { Button } from "@components/Button";
import { CardTrainingSheet } from "@components/CardAdmTrainingSheet";
import { Loading } from "@components/Loading";
import { ScreenHeader } from "@components/ScreenHeader";
import { StudentDTO } from "@dtos/StudentDTO";
import { useStudent } from "@hooks/useStudent";
import { useToast } from "@hooks/useToast";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { AdmStackNavigatorRoutesProps } from "@routes/admin.stack.routes";
import moment from "moment";
import "moment/locale/pt-br";

import { Box, FlatList, HStack, Text, VStack } from "native-base";
import { useEffect, useState } from "react";

interface TrainingSheet {
  id: string;
  name: string;
  createAtFormatted: string;
  isActive: boolean;
}

interface AdmStudentTrainingSheetListProps {
  studentId: string;
}

export function AdmStudentTrainingSheetList() {
  const [trainingSheetList, setTrainingSheetList] = useState<TrainingSheet[]>(
    []
  );
  const [student, setStudent] = useState<StudentDTO>({} as StudentDTO);
  const [isLoading, setIsLoading] = useState(true);
  const { getStudentById, findManyTrainingSheet } = useStudent();
  const { handleError, showToast } = useToast();

  const navigation = useNavigation<AdmStackNavigatorRoutesProps>();
  const isFocused = useIsFocused();
  const route = useRoute();

  const { studentId } = route.params as AdmStudentTrainingSheetListProps;

  function handleCreateTrainingSheet() {
    navigation.navigate("studentTrainingSheet", { studentId });
  }

  function handleOpenStudentTrainingSheet(trainingSheetId: string) {
    navigation.navigate("studentTrainingSheet", { trainingSheetId, studentId });
  }

  async function listTrainingSheets() {
    try {
      const { trainingSheets } = await findManyTrainingSheet(studentId);

      setTrainingSheetList(
        trainingSheets.map((item) => {
          return {
            id: item.id,
            name: item.name,
            isActive: !item.canceled_at ? true : false,
            createAtFormatted: moment(item.create_at).utc().format("ll"),
          } as TrainingSheet;
        })
      );
    } catch (error) {
      handleError(error);
    }
  }

  async function initialScreenLoading() {
    try {
      const studentData = await getStudentById(studentId);
      setStudent(studentData);

      await listTrainingSheets();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    initialScreenLoading();
  }, [isFocused]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1}>
      {/* <ScreenHeader title="Fichas do aluno(a)" /> */}

      <VStack p={4} space={4}>
        <Box p={4} bg="gray.500" borderRadius="md">
          <Text color="gray.200" fontSize="lg">
            Aluno(a): {student?.name}
          </Text>
        </Box>

        <FlatList
          data={trainingSheetList}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <Box h={4} w="full" />}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CardTrainingSheet
              key={item.id}
              {...item}
              onPress={() => handleOpenStudentTrainingSheet(item.id)}
            />
          )}
          ListEmptyComponent={() => (
            <HStack p={4}>
              <Text color="gray.200" textAlign="center" w="full">
                Nenhuma ficha encontrada ou cadastrada.
              </Text>
            </HStack>
          )}
        />

        <Button title="Nova ficha" onPress={handleCreateTrainingSheet} />
      </VStack>
    </VStack>
  );
}
