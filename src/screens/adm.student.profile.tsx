import { useEffect, useState } from "react";
import {
  Center,
  Heading,
  ScrollView,
  Text,
  useToast,
  VStack,
} from "native-base";

import { ScreenHeader } from "@components/ScreenHeader";
import { Input } from "@components/Input";
import { UserPhoto } from "@components/UserPhoto";

import defaultUserPhotoImg from "@assets/userPhotoDefault.png";
import { Button } from "@components/Button";
import { TouchableOpacity } from "react-native";
import { Select } from "@components/Select";
import { useStudent } from "@hooks/useStudent";
import { AppError } from "@utils/AppError";
import { useRoute } from "@react-navigation/native";
import { StudentDTO } from "@dtos/StudentDTO";
import { Loading } from "@components/Loading";

const PHOTO_SIZE = 33;

type RouteParamsProps = {
  studentId: number;
};

export function AdmStudentProfile() {
  const [student, setStudent] = useState<StudentDTO>({} as StudentDTO);
  const [isLoadingStudent, setIsLoadingStudent] = useState(true);

  const route = useRoute();
  const { studentId } = route.params as RouteParamsProps;

  const { getStudentById } = useStudent();
  const toast = useToast();

  async function initialLoading() {
    try {
      const studentData = await getStudentById(studentId);
      setStudent(studentData);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar o cadastro do aluno.";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoadingStudent(false);
    }
  }

  useEffect(() => {
    initialLoading();
  }, [studentId]);

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
              source={defaultUserPhotoImg}
              alt="Foto do usuário"
              size={PHOTO_SIZE}
            />

            <TouchableOpacity>
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
          </Center>
          <Heading color="gray.200" fontSize="md" fontFamily="heading" my={4}>
            Dados básicos
          </Heading>
          <Input placeholder="Nome" bg="gray.600" value={student.name} />
          <Input placeholder="Data de nascimento" bg="gray.600" />
          <Select
            placeholder="Gênero"
            bg="gray.600"
            itens={[
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
            ]}
          />
          <Input placeholder="E-mail" bg="gray.600" />
          <Input placeholder="Telefone" bg="gray.600" />
        </VStack>

        <VStack px={4} pt={2} pb={6}>
          <Button title="Salvar" />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
