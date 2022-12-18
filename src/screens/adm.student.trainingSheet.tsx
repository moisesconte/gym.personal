import { useNavigation, useRoute } from "@react-navigation/native";
import { AdmStackNavigatorRoutesProps } from "@routes/admin.stack.routes";
import {
  Box,
  Divider,
  HStack,
  ScrollView,
  Switch,
  Text,
  VStack,
} from "native-base";
import { useEffect, useState } from "react";
import { LogBox, TouchableOpacity } from "react-native";
import moment from "moment";
import "moment/locale/pt-br";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { useStudent } from "@hooks/useStudent";
import { useToast } from "@hooks/useToast";
import { StudentDTO } from "@dtos/StudentDTO";

type AdmTrainingSheetParams = {
  trainingSheetId: number;
  studentId: number;
};

type FormDataProps = {
  id: number;
  name: string;
  actived: boolean;
  create_at: Date;
};

interface TrainingSheetFormattedProps {
  id: number;
  name: string;
  canceled_at: string;
  create_at: string;

  trainingGroup: {
    id: number;
    name: string;
  }[];
}

const formSchema = yup.object({
  id: yup.number(),
  name: yup.string().required("Campo obrigatório"),
  actived: yup.boolean(),
  create_at: yup.date().nullable(),
});

export function AdmStudentTrainingSheet() {
  const [trainingSheetFormatted, setTrainingSheetFormatted] =
    useState<TrainingSheetFormattedProps>({} as TrainingSheetFormattedProps);
  const [student, setStudent] = useState<StudentDTO>({} as StudentDTO);
  const [isActive, setIsActive] = useState(false);
  const navigation = useNavigation<AdmStackNavigatorRoutesProps>();
  const route = useRoute();

  const {
    getStudentById,
    findTrainingSheetById,
    createTrainingSheet,
    updateTrainingSheet,
  } = useStudent();
  const { handleError, showToast } = useToast();

  const { trainingSheetId, studentId } = route.params as AdmTrainingSheetParams;

  LogBox.ignoreLogs([
    "We can not support a function callback. See Github Issues for details https://github.com/adobe/react-spectrum/issues/2320",
  ]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      actived: true,
    },
  });

  async function handleSubmitForm(formData: FormDataProps) {
    try {
      if (studentId && !trainingSheetId) {
        //create

        await createTrainingSheet({
          name: formData.name,
          student_id: studentId,
        });

        showToast({
          title: "Ficha de treino criada com sucesso!",
          placement: "top",
          bgColor: "green.500",
        });

        navigation.goBack();

        return;
      }

      await updateTrainingSheet({
        trainingSheetId: formData.id,
        name: formData.name,
        actived: formData.actived,
      });

      showToast({
        title: "Ficha de treino atualizada!",
        placement: "top",
        bgColor: "green.500",
      });
      //
    } catch (error) {
      handleError(error);
    }
  }

  function handleOpenStudentTraining(trainingGroupId: number) {
    navigation.navigate("studentTraining", {
      studentId: studentId,
      trainingGroupId: trainingGroupId,
    });
  }

  async function initialScreenLoading() {
    try {
      const studentData = await getStudentById(studentId);
      setStudent(studentData);

      if (trainingSheetId) {
        const { trainingSheet } = await findTrainingSheetById(trainingSheetId);

        setValue("id", trainingSheet.id);
        setValue("name", trainingSheet.name);
        setValue("actived", trainingSheet.canceled_at ? false : true);
        setValue("create_at", trainingSheet.create_at);

        setIsActive(trainingSheet.canceled_at ? false : true);

        setTrainingSheetFormatted({
          id: trainingSheet.id,
          name: trainingSheet.name,
          canceled_at: moment(trainingSheet.canceled_at)
            .utc()
            .format("DD/MMM/YYYY"),
          create_at: moment(trainingSheet.create_at).utc().format("ll"),

          trainingGroup: trainingSheet.trainingGroup.map((trainingGroup) => {
            return {
              id: trainingGroup.id,
              name: trainingGroup.name,
            };
          }),
        });

        return;
      }

      setIsActive(true);
    } catch (error) {
      handleError(error);
    }
  }

  useEffect(() => {
    initialScreenLoading();
  }, []);

  if (!trainingSheetId) {
    return (
      <VStack flex={1}>
        <ScreenHeader title="Nova Ficha" />

        <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
          <VStack p={4}>
            <Input
              label="Aluno(a)"
              bg="gray.600"
              value={student?.name}
              isDisabled
            />

            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => (
                <Input
                  label="Nome da ficha"
                  bg="gray.600"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <HStack alignItems="center" pb={4}>
              <Text color="gray.200" fontSize="md">
                Ficha ativa
              </Text>
              <Switch
                colorScheme="green"
                isChecked={isActive}
                value={isActive}
                onChange={() => {
                  setIsActive((prev) => {
                    setValue("actived", !prev);
                    return !prev;
                  });
                }}
              />
            </HStack>

            <Button
              title="Cadastrar"
              onPress={handleSubmit(handleSubmitForm)}
            />
          </VStack>
        </ScrollView>
      </VStack>
    );
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Ficha do aluno" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 36 }}
      >
        <VStack p={4}>
          <Text color="gray.200" fontSize="lg" textAlign="center" pb={4}>
            Dados da ficha
          </Text>

          <Input
            label="Aluno(a)"
            bg="gray.600"
            value={student?.name}
            isReadOnly
          />

          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                label="Nome da ficha"
                bg="gray.600"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="create_at"
            render={({ field: { value, onChange } }) => (
              <Input
                label="Criado em"
                bg="gray.600"
                value={`${moment(value).utc().format("ll")}`}
                onChangeText={onChange}
                isReadOnly
              />
            )}
          />

          <HStack alignItems="center" pb={4}>
            <Text color="gray.200" fontSize="md">
              Ficha ativa
            </Text>
            <Switch
              colorScheme="green"
              isChecked={isActive}
              value={isActive}
              onChange={() => {
                setIsActive((prev) => {
                  setValue("actived", !prev);
                  return !prev;
                });
              }}
            />
          </HStack>

          <Button title="Salvar" onPress={handleSubmit(handleSubmitForm)} />

          <Divider mt={8} bg="gray.400" />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 36 }}
          >
            <VStack py={4} space={2}>
              <Text color="gray.200" fontSize="lg" textAlign="center" pb={4}>
                Treinos
              </Text>

              {trainingSheetFormatted?.trainingGroup?.map((trainingGroup) => (
                <TouchableOpacity
                  key={trainingGroup.id}
                  onPress={() => handleOpenStudentTraining(trainingGroup.id)}
                >
                  <Box p={4} bg="gray.600" borderRadius="md">
                    <Text color="gray.200" fontSize="lg">
                      {trainingGroup.name}
                    </Text>
                  </Box>
                </TouchableOpacity>
              ))}
            </VStack>
          </ScrollView>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
