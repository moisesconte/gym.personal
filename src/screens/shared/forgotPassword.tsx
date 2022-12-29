import { useNavigation } from "@react-navigation/native";
import { VStack, Image, Text, Center, Heading, ScrollView } from "native-base";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { AuthNavigatorRoutesProps } from "@routes/auth.routes";

import LogoSvg from "@assets/logo.svg";
import BackgroundImg from "@assets/background.png";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppError";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { useToast } from "@hooks/useToast";

interface FormData {
  email: string;
}

const forgotPasswordSchema = yup.object({
  email: yup.string().required("Informe o e-mail.").email("E-mail inválido."),
});

export function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword } = useAuth();
  const { showToast, handleError } = useToast();
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  async function handleSubmitForm(formData: FormData) {
    try {
      setIsLoading(true);
      await forgotPassword(formData.email);
      showToast({
        title: `Foi encaminhado um link de redefinição de senha para o e-mail "${formData.email}".`,
        placement: "top",
        bgColor: "green.500",
      });
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleGoBack() {
    navigation.goBack();
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={10} pb={16}>
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando"
          resizeMode="contain"
          position="absolute"
        />

        <Center my={24}>
          <LogoSvg />

          <Text color="gray.100" fontSize="sm">
            Treine sua mente e o seu corpo
          </Text>
        </Center>

        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Redefinição de senha
          </Heading>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                returnKeyType="next"
                errorMessage={errors.email?.message}
              />
            )}
          />

          <VStack space={4} w="100%">
            <Button
              title="Solicitar redefinição"
              onPress={handleSubmit(handleSubmitForm)}
              isLoadingText="Enviando link..."
              isLoading={isLoading}
            />

            <Button variant="outline" title="Voltar" onPress={handleGoBack} />
          </VStack>
        </Center>
      </VStack>
    </ScrollView>
  );
}
