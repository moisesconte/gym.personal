import { VStack } from "native-base";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { useToast } from "@hooks/useToast";
import { useEffect, useState } from "react";
import { Loading } from "@components/Loading";
import { Button } from "@components/Button";
import { useAssessment } from "@hooks/useAssessment";

interface RouteParamsProps {
  studentId: string;
}

export function AdmisAssessments() {
  const [isLoadingFindAssessments, setIsLoadingFindAssessments] =
    useState(false);

  const { findAllAssessmentByStudentId, isLoadingFindAllAssessment } =
    useAssessment();
  const { showToast, handleError } = useToast();
  const route = useRoute();
  const isFocused = useIsFocused();

  const { studentId } = route.params as RouteParamsProps;

  async function initialLoadingScreen() {
    try {
      const assessments = await findAllAssessmentByStudentId(studentId);

      console.log(assessments);
    } catch (error) {
      handleError(error);
    }
  }

  useEffect(() => {
    initialLoadingScreen();
  }, [isFocused]);

  if (isLoadingFindAssessments) {
    return <Loading />;
  }

  return (
    <VStack flex={1}>
      <Button title="Nova avaliação" />
    </VStack>
  );
}
