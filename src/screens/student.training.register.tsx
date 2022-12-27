import { useIsFocused, useRoute } from "@react-navigation/native";
import { Center, Image, ScrollView, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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
  const [isLoadingSaveExercise, setIsLoadingSaveExercise] = useState(false);

  const [exerciseGroupList, setExerciseGroupsList] = useState<
    ExcerciseGroupDTO[]
  >([]);
  const [exerciseList, setExerciseList] = useState<ExerciseListDTO[]>([]);

  const isFocused = useIsFocused();
  const route = useRoute();
  const { trainingSheetExerciseId, trainingGroupId } =
    route.params as StudentTrainingRegisterProps;
  const {
    findExerciseByTrainingSheetExerciseId,
    findExerciseGroupList,
    findExerciseListByGroupId,
  } = useStudent();
  const { showToast, handleError } = useToast();

  const {
    control,
    handleSubmit,
    setValue,
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

        // console.log("trainingSheetExerciseData => ", trainingSheetExerciseData);
        setTrainingSheetExercise(trainingSheetExerciseData);

        const exercises = await findExerciseListByGroupId(
          trainingSheetExerciseData.exercise.group.id
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
                selectedValue={value}
                itens={exerciseGroupList.map((item) => {
                  return {
                    label: item.name,
                    value: item.id.toString(),
                  };
                })}
                isDisabled
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
                    isDisabled: item.available ? false : true,
                  };
                })}
                isDisabled
                
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
                isDisabled
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
                isDisabled
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
                    uri: `${api.defaults.baseURL}/exercise-demo/${trainingSheetExercise?.exercise?.demo}`,
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
        </VStack>
      </ScrollView>
    </VStack>
  );
}
