import { useEffect, useState } from "react";
import {
  Box,
  Center,
  FlatList,
  ScrollView,
  SectionList,
  Text,
  VStack,
} from "native-base";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import { ScreenHeader } from "@components/ScreenHeader";
import { useStudent } from "@hooks/useStudent";
import { useToast } from "@hooks/useToast";
import { ExercisesDTO } from "@dtos/ExercisesDTO";
import { StudentDTO } from "@dtos/StudentDTO";
import { ExerciseCard } from "@components/ExerciseCard";
import { Button } from "@components/Button";
import { Loading } from "@components/Loading";
import { api } from "@services/api";
import { AdmStackNavigatorRoutesProps } from "@routes/admin.stack.routes";

type AdmStudentTrainingParams = {
  studentId: string;
  trainingGroupId: string;
  trainingGroupName: string;
};

interface ExerciseList {
  groupName: string;
  data: {
    exerciseId: string;
    exerciseName: string;
    repetitions: string;
    series: string;
    trainingSheetId: string;
    exerciseThumb: string;
    exerciseDemo: string;
  }[];
}

export function AdmStudentTraining() {
  const [exerciseList, setExerciseList] = useState<ExerciseList[]>([]);
  const [student, setStudent] = useState<StudentDTO>({} as StudentDTO);
  const [isLoading, setIsLoading] = useState(true);

  const route = useRoute();
  const isFocused = useIsFocused();
  const navigation = useNavigation<AdmStackNavigatorRoutesProps>();
  const { handleError } = useToast();
  const { findExercisesByTrainingGroupId, getStudentById } = useStudent();

  const { trainingGroupId, trainingGroupName, studentId } =
    route.params as AdmStudentTrainingParams;

  async function initialLoadingScreen() {
    try {
      const studentData = await getStudentById(studentId);
      setStudent(studentData);

      const exercises = await findExercisesByTrainingGroupId({
        trainingGroupId: String(trainingGroupId),
      });

      const exercisesFormatted = exercises.map((item) => {
        return {
          trainingSheetId: item.id,
          repetitions: item.repetitions,
          series: item.series,
          exerciseId: item.exercise.id,
          exerciseName: item.exercise.name,
          exerciseDemo: item.exercise.demo,
          exerciseThumb: item.exercise.thumb,
          groupId: item.exercise.group.id,
          groupName: item.exercise.group.name,
        };
      });

      const exercisesGrouped = groupBy(exercisesFormatted, "groupName");

      let exerciseListData: ExerciseList[] = [];

      Object.keys(exercisesGrouped).forEach((key) => {
        exerciseListData.push({
          groupName: key,
          data: exercisesGrouped[key],
        });
      });

      setExerciseList(exerciseListData);
      //
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  function groupBy(array: any[], key: any) {
    return array.reduce((acc, item) => {
      if (!acc[item[key]]) acc[item[key]] = [];
      acc[item[key]].push(item);
      return acc;
    }, {});
  }

  function handleOpenTrainingSheetExercise(trainingSheetExerciseId: string) {
    navigation.navigate("studentTrainingRegister", {
      trainingSheetExerciseId,
      trainingGroupId,
    });
  }

  function handleCreateTrainingSheetExercise() {
    navigation.navigate("studentTrainingRegister", { trainingGroupId });
  }

  useEffect(() => {
    initialLoadingScreen();
  }, [isFocused]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Treino do aluno(a)" />

      <VStack justifyContent="space-between" flex={1} p={4}>
        <VStack flex={1}>
        
          <Box p={4} bg="gray.500" borderRadius="md" mb={4}>
            <Text color="gray.200" fontSize="lg">
              Aluno(a): {student?.name}
            </Text>
            <Text color="gray.300" fontSize="lg">
              Treino/Tipo: {trainingGroupName}
            </Text>
          </Box>

          <SectionList
            sections={exerciseList}
            keyExtractor={(item, index) => item.exerciseId}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ExerciseCard
                name={item.exerciseName}
                series={item.series}
                repetitions={item.repetitions}
                thumb={item.exerciseThumb}
                onPress={() => {
                  handleOpenTrainingSheetExercise(item.trainingSheetId);
                }}
              />
            )}
            renderSectionHeader={({ section }) => (
              <VStack p={4}>
                <Text color="green.500" fontSize="2xl">
                  {section.groupName}
                </Text>
              </VStack>
            )}
            ListEmptyComponent={() => (
              <Center>
                <Text color="gray.200" fontSize="md">
                  Nenhum exercício cadastrado.
                </Text>
              </Center>
            )}
          />
        </VStack>

        <Center>
          <Button
            title="Incluir exercício"
            onPress={handleCreateTrainingSheetExercise}
          />
        </Center>
      </VStack>
    </VStack>
  );
}
