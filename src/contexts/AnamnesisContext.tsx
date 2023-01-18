import { createContext, ReactNode, useState } from "react";

import {
  AnamnesisDTO,
  CreateAnamnesisDTO,
  UpdateAnamnesisDTO,
} from "@dtos/AnamnesisDTO";
import { api } from "@services/api";

export type AnamnesisContextProps = {
  createAnamnesis: (request: CreateAnamnesisDTO) => Promise<void>;
  isLoadingCreatingAnamnesis: boolean;
  findAnamnesisByStudentId: (studentId: string) => Promise<AnamnesisDTO>;
  isLoadingFindAnamnesis: boolean;
  updateAnamnesis: (request: UpdateAnamnesisDTO) => Promise<void>;
  isLoadingUpdatingAnamnesis: boolean;
};

type AnamnesisContextProviderProps = {
  children: ReactNode;
};

export const AnamnesisContext = createContext<AnamnesisContextProps>(
  {} as AnamnesisContextProps
);

export function AnamnesisContextProvider({
  children,
}: AnamnesisContextProviderProps) {
  const [isLoadingCreatingAnamnesis, setIsLoadingCreatingAnamnesis] =
    useState(false);
  const [isLoadingUpdatingAnamnesis, setIsLoadingUpdatingAnamnesis] =
    useState(false);
  const [isLoadingFindAnamnesis, setIsLoadingFindAnamnesis] = useState(false);

  //
  async function createAnamnesis(request: CreateAnamnesisDTO) {
    try {
      setIsLoadingCreatingAnamnesis(true);

      const response = await api.post("/anamnesis/create", request);
      //
    } catch (error) {
      setIsLoadingCreatingAnamnesis(false);
      throw error;
    } finally {
      setIsLoadingCreatingAnamnesis(false);
    }
  }

  async function updateAnamnesis(request: UpdateAnamnesisDTO) {
    try {
      setIsLoadingUpdatingAnamnesis(true);

      const response = await api.post("/anamnesis/update", request);
      //
    } catch (error) {
      setIsLoadingUpdatingAnamnesis(false);
      throw error;
    } finally {
      setIsLoadingUpdatingAnamnesis(false);
    }
  }

  async function findAnamnesisByStudentId(studentId: string) {
    try {
      setIsLoadingFindAnamnesis(true);

      const response = await api.get(`/anamnesis/getById/${studentId}`);

      return response.data.anamnesis;
      //
    } catch (error) {
      setIsLoadingFindAnamnesis(false);
      throw error;
    } finally {
      setIsLoadingFindAnamnesis(false);
    }
  }

  return (
    <AnamnesisContext.Provider
      value={{
        createAnamnesis,
        isLoadingCreatingAnamnesis,
        findAnamnesisByStudentId,
        isLoadingFindAnamnesis,
        updateAnamnesis,
        isLoadingUpdatingAnamnesis,
      }}
    >
      {children}
    </AnamnesisContext.Provider>
  );
}
