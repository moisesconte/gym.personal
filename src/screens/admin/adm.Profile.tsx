import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import {
  Center,
  ScrollView,
  VStack,
  Skeleton,
  Text,
  Heading,
} from "native-base";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { api } from "@services/api";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useAuth } from "@hooks/useAuth";
import { useToast } from "@hooks/useToast";
import defaultUserPhotoImg from "@assets/userPhotoDefault.png";
import { useIsFocused } from "@react-navigation/native";

const PHOTO_SIZE = 33;

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  newPassword: string;
  passwordConfirmation: string;
};

const userSchema = yup.object({
  name: yup.string().required("Informe o nome."),
  email: yup
    .string()
    .required("Informe o seu e-mail")
    .email("E-mail infromado está inválido"),
  password: yup.string().required("Informe a senha atual."),
  newPassword: yup
    .string()
    .required("Informe a nova senha")
    .test("len", "Mínimo de 6 caracteres", (val) => {
      if (val == undefined) {
        return true;
      }
      return val.trim().length >= 6;
    }),
  passwordConfirmation: yup
    .string()
    .oneOf(
      [yup.ref("newPassword"), null],
      "Nova senha está diferente da confirmação de senha."
    ),
});

export function AdmProfile() {
  const { user, updateAvatar, updatePassword } = useAuth();
  const { showToast, handleError } = useToast();

  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState(user.photo_url);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const isFocused = useIsFocused();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(userSchema),
  });

  async function handleSubmitForm(formData: FormDataProps) {
    try {
      setIsUpdateLoading(true);
      const { password, newPassword } = formData;
      await updatePassword(password, newPassword);

      showToast({
        title: "Senha atualizada com sucesso!",
        placement: "top",
        bgColor: "green.500",
      });

      setValue("password", "");
      setValue("newPassword", "");
      setValue("passwordConfirmation", "");
      //
    } catch (error) {
      handleError(error);
    } finally {
      setIsUpdateLoading(false);
    }
  }

  async function handleUserPhotoSelect() {
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
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.uri,
          type: `${photoSelected.type}/${fileExtension}`,
        } as any;

        const userPhotoUploadForm = new FormData();
        userPhotoUploadForm.append("avatar", photoFile);

        if (!user.id) {
          return;
        }

        const avatar_url = await updateAvatar(user.id, userPhotoUploadForm);

        setUserPhoto(avatar_url);

        showToast({
          title: "Avatar atualizado com sucesso",
          placement: "top",
          bgColor: "green.500",
        });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setPhotoIsLoading(false);
    }
  }

  async function initialScreenLoading() {
    setValue("name", user.name);
    setValue("email", user.login);
  }

  useEffect(() => {
    initialScreenLoading();
  }, [isFocused]);

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="6" px={10}>
          {photoIsLoading ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
              startColor="gray.500"
              endColor="gray.400"
            />
          ) : (
            <UserPhoto
              source={
                user.photo_url
                  ? {
                      uri: `${api.defaults.baseURL}/avatar/${userPhoto}`,
                    }
                  : defaultUserPhotoImg
              }
              alt="Foto do usuário"
              size={PHOTO_SIZE}
            />
          )}

          <TouchableOpacity onPress={handleUserPhotoSelect}>
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

          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="Nome"
                bg="gray.600"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="E-mail"
                isDisabled
                value={value}
                onChangeText={onChange}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Heading
            color="gray.200"
            fontSize="md"
            fontFamily="heading"
            mb={2}
            alignSelf="flex-start"
            mt={12}
          >
            Alterar senha
          </Heading>

          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Senha antiga"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="newPassword"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Nova senha"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                errorMessage={errors.newPassword?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="passwordConfirmation"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Confirme a nova senha"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                errorMessage={errors.passwordConfirmation?.message}
              />
            )}
          />

          <Button
            title="Atualizar"
            mt={4}
            isLoading={isUpdateLoading}
            onPress={handleSubmit(handleSubmitForm)}
          />
        </Center>
      </ScrollView>
    </VStack>
  );
}
