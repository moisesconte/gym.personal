import { Center, Heading, ScrollView, Text, VStack } from "native-base";

import { ScreenHeader } from "@components/ScreenHeader";
import { Input } from "@components/Input";
import { UserPhoto } from "@components/UserPhoto";

import defaultUserPhotoImg from "@assets/userPhotoDefault.png";
import { Button } from "@components/Button";
import { TouchableOpacity } from "react-native";

const PHOTO_SIZE = 33;

export function AdmStudentProfile() {
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
          <Input placeholder="Nome" bg="gray.600" />
          <Input placeholder="Data de nascimento" bg="gray.600" />
          <Input placeholder="Gênero" bg="gray.600" />
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
