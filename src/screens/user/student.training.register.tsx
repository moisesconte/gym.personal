import { useIsFocused, useRoute } from "@react-navigation/native";
import {
  Box,
  Center,
  Heading,
  HStack,
  Image,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import SeriesSvg from "@assets/series.svg";
import RepetitionsSvg from "@assets/repetitions.svg";

import { Input } from "@components/Input";
import { Loading } from "@components/Loading";
import { ScreenHeader } from "@components/ScreenHeader";
import { Select } from "@components/Select";
import { ExcerciseGroupDTO } from "@dtos/ExerciseGroupDTO";
import { ExerciseListDTO } from "@dtos/ExerciseListDTO";
import { TrainingSheetExerciseDTO } from "@dtos/trainingSheetExerciseDTO";
import { useStudent } from "@hooks/useStudent";
import { useToast } from "@hooks/useToast";
import { api } from "@services/api";
import { Button } from "@components/Button";

type StudentTrainingRegisterProps = {
  trainingSheetExerciseId: string;
  trainingGroupId: string;
};

type FormDataProps = {
  id: string;
  series: string;
  repetitions: string;
  exerciseGroupId: string;
  exerciseId: string;
};

const formSchema = yup.object({
  id: yup.string(),
  series: yup.string().required("Informe o numéro de série a ser realizado."),
  repetitions: yup
    .string()
    .required("Informe o numéro de repetições a ser realizado."),
  exerciseGroupId: yup.string().required("Informe o grupo do exercício."),
  exerciseId: yup.string().required("Informe o exercício."),
});

export function StudentTrainingRegister() {
  const [trainingSheetExercise, setTrainingSheetExercise] =
    useState<TrainingSheetExerciseDTO>({} as TrainingSheetExerciseDTO);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMarkAsDone, setIsLoadingMarkAsDone] = useState(false);

  const isFocused = useIsFocused();
  const route = useRoute();
  const { trainingSheetExerciseId, trainingGroupId } =
    route.params as StudentTrainingRegisterProps;
  const { findExerciseByTrainingSheetExerciseId, markAsDoneExercise } =
    useStudent();
  const { showToast, handleError } = useToast();

  async function initialLoadingScreen() {
    try {
      if (trainingSheetExerciseId) {
        const trainingSheetExerciseData =
          await findExerciseByTrainingSheetExerciseId({
            trainingSheetExerciseId,
          });

        // console.log("trainingSheetExerciseData => ", trainingSheetExerciseData);
        setTrainingSheetExercise(trainingSheetExerciseData);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMarkAsDoneExercise() {
    try {
      setIsLoadingMarkAsDone(true);
      await markAsDoneExercise(trainingSheetExercise.exercise_id);

      showToast({
        title: "Exercício marcado como realizado!",
        placement: "top",
        bgColor: "green.500",
      });
      //
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoadingMarkAsDone(false);
    }
  }

  useEffect(() => {
    initialLoadingScreen();
  }, [isFocused]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1}>
      {/* <ScreenHeader title="Exercício" /> */}

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <VStack p={8}>
          <Image
            w="full"
            h={80}
            source={{
              uri: trainingSheetExercise?.exercise?.demo//`${api.defaults.baseURL}/exercise-demo/${trainingSheetExercise?.exercise?.demo}`,
            }}
            alt={`Demonstração do exercício ${trainingSheetExercise.exercise.name}`}
            mb={3}
            resizeMode="cover"
            rounded="lg"
          />

          <Box bg="gray.600" rounded="md" pb={4} px={4}>
            <VStack mt={5} space={2} px={4}>
              <Heading color="gray.200">
                {trainingSheetExercise.exercise.name}
              </Heading>
              <Text color="gray.300" fontSize="md">
                Grupo - {trainingSheetExercise.exercise.group.name}
              </Text>
            </VStack>

            <HStack
              alignItems="center"
              justifyContent="space-between"
              mb={6}
              mt={3}
              px={4}
            >
              <HStack alignItems="center">
                <SeriesSvg />
                <Text color="gray.200" ml={2}>
                  {trainingSheetExercise?.series} séries
                </Text>
              </HStack>

              <HStack alignItems="center">
                <RepetitionsSvg />
                <Text color="gray.200" ml={2}>
                  {trainingSheetExercise?.repetitions} repetições
                </Text>
              </HStack>
            </HStack>

            <Button
              title="Marcar como realizado"
              isLoading={isLoadingMarkAsDone}
              onPress={handleMarkAsDoneExercise}
            />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
