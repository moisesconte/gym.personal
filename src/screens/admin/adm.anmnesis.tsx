import { HStack, ScrollView, Text, VStack } from "native-base";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@components/Input";
import { Radio } from "@components/Radio";
import { Button } from "@components/Button";
import { TextArea } from "@components/TextArea";
import { useAnamnesis } from "@hooks/useAnamnesis";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { useToast } from "@hooks/useToast";
import { useEffect, useState } from "react";
import { Loading } from "@components/Loading";

interface FormDataProps {
  physical_activity: boolean; //Pratica de atividade física?
  what_physical_activity: string; //qual atividade?
  how_many_times_week: number; //Quantas vezes na semana?
  alcoholic_beverages: boolean; //Consome bebidas alcoólicas?
  smoker: boolean; //Fumante?
  back_problems: boolean; //problemas de coluna?
  high_cholesterol: boolean; //Possuí colesterol alto?
  hdl_cholesterol: number; //Colesterol - HDL?
  ldl_cholesterol: number; //Colesterol - LDL?
  hypertensive: boolean; //É hipertenso (pressão alta) ?
  high_triglycerides: boolean; //Possuí triglicérides alto?
  diabetes: boolean; //É diabético?
  breathing_problems: boolean; //Tem problemas respiratórios?
  what_breathing_problems: string; //Qual?
  cardiac_alteration: boolean; //Possuí alguma alteração cardíaca?
  what_cardiac_alteration: string; //Qual?
  medical_restrictions: boolean; //Alguma recomendação ou restrição médica para prática de exercícios?
  what_medical_restrictions: string; //Qual?
  comments: string; //Gostaria de fazer algum tipo de comentário que possa ajudar na montagem do seu programa de treinamento?
}

interface RouteParamsProps {
  studentId: string;
}

const radioOptions = [
  {
    label: "Sim",
    value: "true",
  },
  {
    label: "Não",
    value: "false",
  },
];

const formSchema = yup.object({
  physical_activity: yup.boolean().required("Campo obrigátorio"),
  what_physical_activity: yup
    .string()
    .nullable()
    .when("physical_activity", {
      is: true,
      then: yup.string().typeError("Valor inválido").required("Obrigatório o preenchimento"),
    }),
  how_many_times_week: yup
    .number()
    .nullable()
    .when("physical_activity", {
      is: true,
      then: yup.number().typeError("Valor inválido").required("Obrigatório o preenchimento"),
    }),
  alcoholic_beverages: yup.boolean().required("Campo obrigátorio"),
  smoker: yup.boolean().required("Campo obrigátorio"),
  back_problems: yup.boolean().required("Campo obrigátorio"),
  high_cholesterol: yup.boolean().required("Campo obrigátorio"),
  hdl_cholesterol: yup
    .number()
    .nullable()
    .when("high_cholesterol", {
      is: true,
      then: yup.number().typeError("Valor inválido").required("Obrigatório o preenchimento"),
    }),
  ldl_cholesterol: yup
    .number()
    .nullable()
    .when("high_cholesterol", {
      is: true,
      then: yup.number().typeError("Valor inválido").required("Obrigatório o preenchimento"),
    }),
  hypertensive: yup.boolean().required("Campo obrigátorio"),
  high_triglycerides: yup.boolean().required("Campo obrigátorio"),
  diabetes: yup.boolean().required("Campo obrigátorio"),
  breathing_problems: yup.boolean().required("Campo obrigátorio"),
  what_breathing_problems: yup
    .string()
    .nullable()
    .when("breathing_problems", {
      is: true,
      then: yup.string().required("Obrigatório o preenchimento"),
    }),
  cardiac_alteration: yup.boolean().required("Campo obrigátorio"),
  what_cardiac_alteration: yup
    .string()
    .nullable()
    .when("cardiac_alteration", {
      is: true,
      then: yup.string().required("Obrigatório o preenchimento"),
    }),
  medical_restrictions: yup.boolean().required("Campo obrigátorio"),
  what_medical_restrictions: yup
    .string()
    .nullable()
    .when("medical_restrictions", {
      is: true,
      then: yup.string().required("Obrigatório o preenchimento"),
    }),
});

export function AdmAnamnesis() {
  const [anamnesisId, setAnamnesisId] = useState("");

  const {
    createAnamnesis,
    isLoadingCreatingAnamnesis,
    findAnamnesisByStudentId,
    isLoadingFindAnamnesis,
    updateAnamnesis,
    isLoadingUpdatingAnamnesis,
  } = useAnamnesis();
  const { showToast, handleError } = useToast();
  const route = useRoute();
  const isFocused = useIsFocused();

  const { studentId } = route.params as RouteParamsProps;

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(formSchema),
  });

  async function handleFormSubmit(formData: FormDataProps) {
    // console.log(formData);

    try {
      if (!studentId) {
        await createAnamnesis({
          ...formData,
          student_id: studentId,
        });

        showToast({
          title: "Anamnese cadastrada com sucesso!",
          placement: "top",
          bgColor: "green.500",
        });

        return;
      }

      await updateAnamnesis({
        ...formData,
        id: anamnesisId,
      });

      showToast({
        title: "Anamnese atualizada com sucesso!",
        placement: "top",
        bgColor: "green.500",
      });
      //
    } catch (error) {
      handleError(error);
    }
  }

  async function initialLoadingScreen() {
    try {
      const anamnesis = await findAnamnesisByStudentId(studentId);

      if (anamnesis) {
        const {
          id,
          physical_activity,
          what_physical_activity,
          how_many_times_week,
          alcoholic_beverages,
          smoker,
          back_problems,
          high_cholesterol,
          hdl_cholesterol,
          ldl_cholesterol,
          hypertensive,
          high_triglycerides,
          diabetes,
          breathing_problems,
          what_breathing_problems,
          cardiac_alteration,
          what_cardiac_alteration,
          medical_restrictions,
          what_medical_restrictions,
          comments,
        } = anamnesis;

        setValue("physical_activity", physical_activity);
        setValue("what_physical_activity", what_physical_activity);
        setValue("how_many_times_week", how_many_times_week);
        setValue("alcoholic_beverages", alcoholic_beverages);
        setValue("smoker", smoker);
        setValue("back_problems", back_problems);
        setValue("high_cholesterol", high_cholesterol);
        setValue("hdl_cholesterol", hdl_cholesterol);
        setValue("ldl_cholesterol", ldl_cholesterol);
        setValue("hypertensive", hypertensive);
        setValue("high_triglycerides", high_triglycerides);
        setValue("diabetes", diabetes);
        setValue("breathing_problems", breathing_problems);
        setValue("what_breathing_problems", what_breathing_problems);
        setValue("cardiac_alteration", cardiac_alteration);
        setValue("what_cardiac_alteration", what_cardiac_alteration);
        setValue("medical_restrictions", medical_restrictions);
        setValue("what_medical_restrictions", what_medical_restrictions);
        setValue("comments", comments);

        setAnamnesisId(id);
      }
    } catch (error) {
      setAnamnesisId("");
      handleError(error);
    }
  }

  useEffect(() => {
    setAnamnesisId("");
    initialLoadingScreen();
  }, [isFocused]);

  if (isLoadingFindAnamnesis) {
    return <Loading />;
  }

  return (
    <VStack flex={1}>
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <VStack p={4}>
          <Controller
            control={control}
            name="physical_activity"
            render={({ field: { name, value, onChange } }) => (
              <Radio
                name={name}
                label="Pratica atividade física?"
                value={String(value)}
                onChange={onChange}
                defaultValue="false"
                options={radioOptions}
                errorMessage={errors.physical_activity?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="what_physical_activity"
            render={({ field: { value, onChange } }) => (
              <TextArea
                label="Qual?"
                bg="gray.600"
                placeholder="Descreva as atividades"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.what_physical_activity?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="how_many_times_week"
            render={({ field: { value, onChange } }) => (
              <Input
                label="Quantas vezes na semana?"
                bg="gray.600"
                keyboardType="number-pad"
                value={value ? String(value) : undefined}
                onChangeText={onChange}
                errorMessage={errors.how_many_times_week?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="alcoholic_beverages"
            render={({ field: { name, value, onChange } }) => (
              <Radio
                name={name}
                label="Consome bebidas alcoólicas?"
                value={String(value)}
                onChange={onChange}
                defaultValue="false"
                options={radioOptions}
                errorMessage={errors.alcoholic_beverages?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="smoker"
            render={({ field: { name, value, onChange } }) => (
              <Radio
                name={name}
                label="Fumante?"
                value={String(value)}
                onChange={onChange}
                defaultValue="false"
                options={radioOptions}
                errorMessage={errors.smoker?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="back_problems"
            render={({ field: { name, value, onChange } }) => (
              <Radio
                name={name}
                label="Problemas de coluna?"
                value={String(value)}
                onChange={onChange}
                defaultValue="false"
                options={radioOptions}
                errorMessage={errors.back_problems?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="high_cholesterol"
            render={({ field: { name, value, onChange } }) => (
              <Radio
                name={name}
                label="Possuí colesterol alto?"
                value={String(value)}
                onChange={onChange}
                defaultValue="false"
                options={radioOptions}
                errorMessage={errors.high_cholesterol?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="hdl_cholesterol"
            render={({ field: { value, onChange } }) => (
              <Input
                label="Colesterol - HDL"
                bg="gray.600"
                keyboardType="number-pad"
                value={value ? String(value) : undefined}
                onChangeText={onChange}
                errorMessage={errors.hdl_cholesterol?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="ldl_cholesterol"
            render={({ field: { value, onChange } }) => (
              <Input
                label="Colesterol - LDL"
                bg="gray.600"
                keyboardType="number-pad"
                value={value ? String(value) : undefined}
                onChangeText={onChange}
                errorMessage={errors.ldl_cholesterol?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="high_triglycerides"
            render={({ field: { name, value, onChange } }) => (
              <Radio
                name={name}
                label="Possuí triglicérides alto?"
                value={String(value)}
                onChange={onChange}
                defaultValue="false"
                options={radioOptions}
                errorMessage={errors.high_triglycerides?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="hypertensive"
            render={({ field: { name, value, onChange } }) => (
              <Radio
                name={name}
                label="É hipertenso (pressão alta)?"
                value={String(value)}
                onChange={onChange}
                defaultValue="false"
                options={radioOptions}
                errorMessage={errors.hypertensive?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="diabetes"
            render={({ field: { name, value, onChange } }) => (
              <Radio
                name={name}
                label="É diabético?"
                value={String(value)}
                onChange={onChange}
                defaultValue="false"
                options={radioOptions}
                errorMessage={errors.diabetes?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="breathing_problems"
            render={({ field: { name, value, onChange } }) => (
              <Radio
                name={name}
                label="Tem problemas respiratórios?"
                value={String(value)}
                onChange={onChange}
                defaultValue="false"
                options={radioOptions}
                errorMessage={errors.breathing_problems?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="what_breathing_problems"
            render={({ field: { value, onChange } }) => (
              <TextArea
                label="Qual?"
                bg="gray.600"
                placeholder="Descreva o problema"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.what_breathing_problems?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="cardiac_alteration"
            render={({ field: { name, value, onChange } }) => (
              <Radio
                name={name}
                label="Possuí alguma alteração cardíaca?"
                value={String(value)}
                onChange={onChange}
                defaultValue="false"
                options={radioOptions}
                errorMessage={errors.cardiac_alteration?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="what_cardiac_alteration"
            render={({ field: { value, onChange } }) => (
              <TextArea
                label="Qual?"
                bg="gray.600"
                placeholder="Descreva a alteração"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.what_cardiac_alteration?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="medical_restrictions"
            render={({ field: { name, value, onChange } }) => (
              <Radio
                name={name}
                label="Alguma recomendação ou restrição médica para prática de exercícios?"
                value={String(value)}
                onChange={onChange}
                defaultValue="false"
                options={radioOptions}
                errorMessage={errors.medical_restrictions?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="what_medical_restrictions"
            render={({ field: { value, onChange } }) => (
              <TextArea
                label="Qual?"
                bg="gray.600"
                placeholder="Descreva a recomendação ou restrição médica"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.what_medical_restrictions?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="comments"
            render={({ field: { value, onChange } }) => (
              <TextArea
                label="Gostaria de fazer algum tipo de comentário que possa ajudar na montagem do seu programa de treinamento?"
                bg="gray.600"
                placeholder="Descreva..."
                value={value}
                numberOfLines={5}
                h={24}
                onChangeText={onChange}
                errorMessage={errors.comments?.message}
              />
            )}
          />

          <VStack mt={4}>
            <Button
              title="Salvar"
              onPress={handleSubmit(handleFormSubmit)}
              isLoading={
                isLoadingCreatingAnamnesis || isLoadingUpdatingAnamnesis
              }
            />
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
