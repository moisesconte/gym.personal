import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Box,
  Divider,
  HStack,
  Icon,
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
import { Entypo } from "@expo/vector-icons";

import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { useStudent } from "@hooks/useStudent";
import { useToast } from "@hooks/useToast";
import { StudentDTO } from "@dtos/StudentDTO";
import { Loading } from "@components/Loading";
import { useAuth } from "@hooks/useAuth";
import { AppStackNavigatorRoutesProps } from "@routes/app.stack.routes";

type StudentTrainingSheetParams = {
  trainingSheetId: string;
};

type FormDataProps = {
  id: string;
  name: string;
  actived: boolean;
  create_at: Date;
};

interface TrainingSheetFormattedProps {
  id: string;
  name: string;
  canceled_at: string;
  create_at: string;

  trainingGroup: {
    id: string;
    name: string;
  }[];
}

interface TrainingGroup {
  id: string;
  name: string;
}

const formSchema = yup.object({
  id: yup.string(),
  name: yup.string().required("Campo obrigatório"),
  actived: yup.boolean(),
  create_at: yup.date().nullable(),
});

export function StudentTrainingSheet() {
  const [trainingSheetFormatted, setTrainingSheetFormatted] =
    useState<TrainingSheetFormattedProps>({} as TrainingSheetFormattedProps);
  const [student, setStudent] = useState<StudentDTO>({} as StudentDTO);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation<AppStackNavigatorRoutesProps>();
  const route = useRoute();

  const { user } = useAuth();

  const { getStudentById, findTrainingSheetById } = useStudent();
  const { handleError, showToast } = useToast();

  const { trainingSheetId } = route.params as StudentTrainingSheetParams;

  LogBox.ignoreLogs([
    "We can not support a function callback. See Github Issues for details https://github.com/adobe/react-spectrum/issues/2320",
  ]);

  const {
    control,
    setValue,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      actived: true,
    },
  });

  function handleOpenStudentTraining(trainingGroup: TrainingGroup) {
    navigation.navigate("studentTraining", {
      studentId: user.student_id!,
      trainingGroupId: trainingGroup.id,
      trainingGroupName: trainingGroup.name,
    });
  }

  async function initialScreenLoading() {
    try {
      const studentData = await getStudentById(user.student_id!);
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
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    initialScreenLoading();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Ficha do aluno(a)" />

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
                isReadOnly
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
              isDisabled
              onChange={() => {
                setIsActive((prev) => {
                  setValue("actived", !prev);
                  return !prev;
                });
              }}
            />
          </HStack>

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
                  onPress={() => handleOpenStudentTraining(trainingGroup)}
                >
                  <HStack
                    p={4}
                    bg="gray.600"
                    borderRadius="md"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Text color="gray.200" fontSize="lg">
                      {trainingGroup.name}
                    </Text>
                    <Icon
                      as={Entypo}
                      name="chevron-thin-right"
                      color="gray.300"
                    />
                  </HStack>
                </TouchableOpacity>
              ))}
            </VStack>
          </ScrollView>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
