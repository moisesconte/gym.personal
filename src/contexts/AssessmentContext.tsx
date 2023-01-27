import { createContext, ReactNode, useState } from "react";

import { AnamnesisDTO } from "@dtos/AnamnesisDTO";
import { api } from "@services/api";

export type AssessmentContextProps = {
  findAllAssessmentByStudentId: (studentId: string) => Promise<AnamnesisDTO>;
  isLoadingFindAllAssessment: boolean;
};

type AssessmentContextProviderProps = {
  children: ReactNode;
};

export const AssessmentContext = createContext<AssessmentContextProps>(
  {} as AssessmentContextProps
);

export function AssessmentContextProvider({
  children,
}: AssessmentContextProviderProps) {
  const [isLoadingFindAllAssessment, setIsLoadingFindAllAssessment] =
    useState(false);

  async function findAllAssessmentByStudentId(studentId: string) {
    try {
      setIsLoadingFindAllAssessment(true);

      const response = await api.get(`/assessment/getAll/${studentId}`);

      return response.data.assessments;
      //
    } catch (error) {
      setIsLoadingFindAllAssessment(false);
      throw error;
    } finally {
      setIsLoadingFindAllAssessment(false);
    }
  }

  return (
    <AssessmentContext.Provider
      value={{
        findAllAssessmentByStudentId,
        isLoadingFindAllAssessment,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}
