import { useEffect, useState } from "react";
import { Platform, TouchableOpacity } from "react-native";
import {
  Center,
  Heading,
  HStack,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import defaultUserPhotoImg from "@assets/userPhotoDefault.png";

import { ScreenHeader } from "@components/ScreenHeader";
import { Input } from "@components/Input";
import { UserPhoto } from "@components/UserPhoto";
import { Button } from "@components/Button";
import { Select } from "@components/Select";
import { Loading } from "@components/Loading";
import { InputDateTime } from "@components/InputDateTime";

import { StudentDTO } from "@dtos/StudentDTO";

import { useStudent } from "@hooks/useStudent";
import { useToast } from "@hooks/useToast";
import { api } from "@services/api";
import { AdmStackNavigatorRoutesProps } from "@routes/admin.stack.routes";

const PHOTO_SIZE = 33;

type RouteParamsProps = {
  studentId?: string;
};

type FormDataProps = {
  name: string;
  birth_date: Date;
  genre: string;
  phone: string;
  photo_url: string;
  email: string;
};

const studentSchema = yup.object({
  name: yup.string().required("Informe o nome."),
  birth_date: yup.date().required("Informe a data de nascimento."),
  genre: yup.string().required("Informe o gênero."),
  phone: yup.string().nullable(),
  photo_url: yup.string(),
  email: yup.string().required("Informe o e-mail.").email("E-mail inválido."),
});

const genreTypes = [
  {
    label: "Feminino",
    value: "F",
  },
  {
    label: "Masculino",
    value: "M",
  },
  {
    label: "Não informar",
    value: "N",
  },
];

export function AdmStudentProfile() {
  const [student, setStudent] = useState<StudentDTO>({} as StudentDTO);
  const [isLoadingStudent, setIsLoadingStudent] = useState(true);
  const [isLoadingCreateCredential, setIsLoadingCreateCredential] =
    useState(false);
  const [photoIsLoading, setPhotoIsLoading] = useState(false);

  const [mode, setMode] = useState<any>("date");
  const [show, setShow] = useState(false);

  const navigation = useNavigation<AdmStackNavigatorRoutesProps>();
  const isFocused = useIsFocused();
  const route = useRoute();
  const { studentId } = route.params as RouteParamsProps;

  const {
    getStudentById,
    createStudent,
    updateStudent,
    updateAvatar,
    createCredentialApp,
  } = useStudent();
  const { handleError, showToast } = useToast();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(studentSchema),
  });

  async function initialLoading() {
    try {
      reset({
        name: "",
        birth_date: undefined,
        email: "",
        genre: "",
        phone: "",
        photo_url: "",
      });

      setStudent({} as StudentDTO);

      if (studentId) {
        const studentData = await getStudentById(studentId);

        setValue("name", studentData?.name);
        setValue("birth_date", new Date(studentData?.birth_date));
        setValue("genre", studentData?.genre);
        setValue("email", studentData?.email);
        setValue("phone", studentData?.phone);

        setStudent(studentData);

        return;
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoadingStudent(false);
    }
  }

  async function handleSubmitForm(formData: FormDataProps) {
    try {
      const { name, birth_date, genre, email, phone, photo_url } = formData;

      if (!studentId) {
        //insert
        await createStudent({
          name,
          birth_date: moment(birth_date).utc().format("YYYY-MM-DD"),
          email,
          genre,
          phone,
          photo_url,
        });

        showToast({
          title: "Aluno(a) cadastrado com sucesso",
          placement: "top",
          bgColor: "green.500",
        });

        navigation.goBack();

        return;
      }

      //update
      await updateStudent({
        student_id: studentId,
        name,
        birth_date: moment(birth_date).utc().format("YYYY-MM-DD"),
        email,
        genre,
        phone: phone ?? "",
        photo_url,
      });

      showToast({
        title: "Cadastrado atualizado com sucesso",
        placement: "top",
        bgColor: "green.500",
      });
    } catch (error) {
      handleError(error);
    }
  }

  async function handleStudentPhotoSelect() {
    setPhotoIsLoading(true);

    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.cancelled) {
        return;
      }

      if (photoSelected.uri) {
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.uri);

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return showToast({
            title: "Essa imagem é muito grande. Escolha uma de até 5MB.",
            placement: "top",
            bgColor: "red.500",
          });
        }

        const fileExtension = photoSelected.uri.split(".").pop();

        const photoFile = {
          name: `${student.name}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.uri,
          type: `${photoSelected.type}/${fileExtension}`,
        } as any;

        const studentPhotoUploadForm = new FormData();
        studentPhotoUploadForm.append("avatar", photoFile);

        if (!studentId) {
          return;
        }

        const { photo_url } = await updateAvatar(
          studentId,
          studentPhotoUploadForm
        );

        student.photo_url = photo_url;

        showToast({
          title: "Avatar atualizado com sucesso",
          placement: "top",
          bgColor: "green.500",
        });
      }
    } catch (error) {
      console.log(error);
      handleError(error);
    } finally {
      setPhotoIsLoading(false);
    }
  }

  function handleStudentTrainingSheet() {
    navigation.navigate("studentTrainingSheetList", {
      studentId,
    });
  }

  async function handleCreateCredentialApp() {
    try {
      setIsLoadingCreateCredential(true);
      await createCredentialApp(student.email);

      showToast({
        title:
          "Acesso ao aplicativo criado com sucesso! Foi encaminhado os dados de acesso para o e-mail cadastrado.",
        placement: "top",
        bgColor: "green.500",
      });
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoadingCreateCredential(false);
      initialLoading();
    }
  }

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setValue("birth_date", new Date(currentDate));
    //setBirthDate(new Date(currentDate));
    setShow(false);
  };

  const showMode = (currentMode: any) => {
    if (Platform.OS === "android") {
      setShow(false);
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);
  };

  useEffect(() => {
    initialLoading();
  }, [isFocused]);

  if (isLoadingStudent) {
    return <Loading />;
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil do aluno" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <VStack p={4}>
          <Center>
            <UserPhoto
              source={
                student.photo_url
                  ? {
                      uri: `${api.defaults.baseURL}/avatar/${student.photo_url}`,
                    }
                  : defaultUserPhotoImg
              }
              alt="Foto do usuário"
              size={PHOTO_SIZE}
            />

            {studentId && (
              <TouchableOpacity onPress={handleStudentPhotoSelect}>
                <Text
                  color="green.500"
                  fontWeight="bold"
                  fontSize="md"
                  mt={2}
                  mb={8}
                >
                  Alterar foto
                </Text>
              </TouchableOpacity>
            )}
          </Center>
          <Heading color="gray.200" fontSize="md" fontFamily="heading" my={4}>
            Dados básicos
          </Heading>

          <Controller
            control={control}
            defaultValue={undefined}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                label="Nome"
                bg="gray.600"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="birth_date"
            defaultValue={undefined}
            render={({ field: { onChange, value } }) => (
              <Pressable onPress={() => setShow(true)}>
                <InputDateTime
                  label="Data de nascimento"
                  bg="gray.600"
                  value={
                    value ? moment(value).utc().format("DD/MM/YYYY") : undefined
                  }
                  isReadOnly
                  errorMessage={errors.birth_date?.message}
                />
              </Pressable>
            )}
          />

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date()}
              mode={mode}
              is24Hour={true}
              onChange={onChange}
            />
          )}

          <Controller
            control={control}
            name="genre"
            render={({ field: { value, onChange } }) => (
              <Select
                label="Gênero"
                bg="gray.600"
                itens={genreTypes}
                onValueChange={onChange}
                selectedValue={value}
                errorMessage={errors.genre?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                label="E-mail"
                bg="gray.600"
                keyboardType="email-address"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { value, onChange } }) => (
              <Input
                label="Telefone"
                bg="gray.600"
                keyboardType="phone-pad"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.phone?.message}
              />
            )}
          />
        </VStack>

        <VStack px={4} pt={2} pb={6} space={4}>
          <Button
            title={studentId ? "Salvar" : "Cadastrar"}
            onPress={handleSubmit(handleSubmitForm)}
          />
          {studentId && (
            <>
              <Button variant="outline" title="Avaliações" />
              <Button
                variant="outline"
                title="Fichas"
                onPress={handleStudentTrainingSheet}
              />
              {!student.user?.login && (
                <Button
                  variant="outline"
                  title="Criar acesso ao app"
                  isLoading={isLoadingCreateCredential}
                  onPress={handleCreateCredentialApp}
                />
              )}
            </>
          )}
        </VStack>
      </ScrollView>
    </VStack>
  );
}
