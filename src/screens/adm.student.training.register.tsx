import { useIsFocused, useRoute } from "@react-navigation/native";
import { Center, Image, ScrollView, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Button } from "@components/Button";
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

type AdmStudentTrainingRegisterProps = {
  trainingSheetExerciseId: number;
  trainingGroupId: number;
};

type FormDataProps = {
  id: number;
  series: string;
  repetitions: string;
  exerciseGroupId: string;
  exerciseId: string;
};

const formSchema = yup.object({
  id: yup.number(),
  series: yup.string().required("Informe o numéro de série a ser realizado."),
  repetitions: yup
    .string()
    .required("Informe o numéro de repetições a ser realizado."),
  exerciseGroupId: yup.string().required("Informe o grupo do exercício."),
  exerciseId: yup.string().required("Informe o exercício."),
});

export function AdmStudentTrainingRegister() {
  const [trainingSheetExercise, setTrainingSheetExercise] =
    useState<TrainingSheetExerciseDTO>({} as TrainingSheetExerciseDTO);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSaveExercise, setIsLoadingSaveExercise] = useState(false);

  const [exerciseGroupList, setExerciseGroupsList] = useState<
    ExcerciseGroupDTO[]
  >([]);
  const [exerciseList, setExerciseList] = useState<ExerciseListDTO[]>([]);

  const isFocused = useIsFocused();
  const route = useRoute();
  const { trainingSheetExerciseId, trainingGroupId } =
    route.params as AdmStudentTrainingRegisterProps;
  const {
    findExerciseByTrainingSheetExerciseId,
    findExerciseGroupList,
    findExerciseListByGroupId,
    trainingExerciseAdd,
  } = useStudent();
  const { showToast, handleError } = useToast();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(formSchema),
  });

  async function initialLoadingScreen() {
    try {
      const groups = await findExerciseGroupList();
      setExerciseGroupsList(groups);

      if (trainingSheetExerciseId) {
        const trainingSheetExerciseData =
          await findExerciseByTrainingSheetExerciseId({
            trainingSheetExerciseId,
          });
        setTrainingSheetExercise(trainingSheetExerciseData);

        const exercises = await findExerciseListByGroupId(
          String(trainingSheetExerciseData.exercise.group.id)
        );

        setExerciseList(exercises);

        const { id, exercise, series, repetitions } = trainingSheetExerciseData;

        setValue("id", id);
        setValue("exerciseGroupId", String(exercise.group.id));
        setValue("exerciseId", String(exercise.id));
        setValue("series", series.toString());
        setValue("repetitions", repetitions);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmitForm(formData: FormDataProps) {
    try {
      console.log(formData);
      setIsLoadingSaveExercise(true);

      const { id, series, repetitions, exerciseGroupId, exerciseId } = formData;
      if (!trainingSheetExerciseId) {
        //create
        await trainingExerciseAdd({
          series: Number(series),
          repetitions,
          trainingGroupId,
          exerciseId: Number(exerciseId),
        });

        showToast({
          title: "Exercício adicionado na ficha do aluno(a).",
          placement: "top",
          bgColor: "green.500",
        });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoadingSaveExercise(false);
    }
  }

  async function handleOpenSelectExerciseGroups() {
    try {
      const groups = await findExerciseGroupList();
      setExerciseGroupsList(groups);
    } catch (error) {
      handleError(error);
    }
  }

  async function handleOpenSelectExercises(exerciseGroupId: string) {
    try {
      const exercises = await findExerciseListByGroupId(exerciseGroupId);
      setExerciseList(exercises);
    } catch (error) {
      handleError(error);
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
      <ScreenHeader title="Cadastro de exercício" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <VStack p={4}>
          <Controller
            control={control}
            name="exerciseGroupId"
            render={({ field: { value, onChange } }) => (
              <Select
                label="Grupo"
                bgColor="gray.600"
                onOpen={handleOpenSelectExerciseGroups}
                selectedValue={value}
                onValueChange={async (itemSelected) => {
                  await handleOpenSelectExercises(itemSelected);
                  onChange(itemSelected);
                }}
                itens={exerciseGroupList.map((item) => {
                  return {
                    label: item.name,
                    value: item.id.toString(),
                  };
                })}
                isDisabled={!!trainingSheetExerciseId}
                errorMessage={errors.exerciseGroupId?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="exerciseId"
            render={({ field: { value, onChange } }) => (
              <Select
                label="Exercício"
                bgColor="gray.600"
                selectedValue={value}
                onValueChange={onChange}
                itens={exerciseList.map((item) => {
                  return {
                    label: item.name,
                    value: item.id.toString(),
                  };
                })}
                isDisabled={!!trainingSheetExerciseId}
                errorMessage={errors.exerciseId?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="series"
            render={({ field: { value, onChange } }) => (
              <Input
                label="Série"
                value={value}
                onChangeText={onChange}
                bgColor="gray.600"
                keyboardType="number-pad"
                errorMessage={errors.series?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="repetitions"
            render={({ field: { value, onChange } }) => (
              <Input
                label="Repetições"
                value={value}
                onChangeText={onChange}
                bgColor="gray.600"
                keyboardType="number-pad"
                errorMessage={errors.repetitions?.message}
              />
            )}
          />

          {trainingSheetExerciseId && (
            <VStack pb={4}>
              <Text color="gray.300" fontSize="lg" pb={1}>
                Demonstração
              </Text>
              <Center>
                <Image
                  source={{
                    uri: `${api.defaults.baseURL}/exercise/demo/${trainingSheetExercise?.exercise?.demo}`,
                  }}
                  alt="Demonstração do exercício"
                  w={64}
                  h={64}
                  rounded="md"
                  resizeMode="contain"
                />
              </Center>
            </VStack>
          )}

          <VStack space={4}>
            {trainingSheetExerciseId && (
              <Button
                title="Excluir"
                bg="red.500"
                _pressed={{
                  bg: "red.400",
                }}
              />
            )}
            {!trainingSheetExerciseId && (
              <Button
                title="Salvar"
                onPress={handleSubmit(handleSubmitForm)}
                isLoading={isLoadingSaveExercise}
              />
            )}
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
