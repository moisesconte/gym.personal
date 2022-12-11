import { StudentDTO } from "@dtos/StudentDTO";
import { api } from "@services/api";
import { createContext, ReactNode } from "react";

export type StudentContextProps = {
  getAllStudent: () => Promise<StudentDTO[]>;
  getStudentById: (studentId: number) => Promise<StudentDTO>;
};

type StudentContextProviderProps = {
  children: ReactNode;
};

export const StudentContext = createContext<StudentContextProps>(
  {} as StudentContextProps
);

export function StudentContextProvider({
  children,
}: StudentContextProviderProps) {
  async function getAllStudent() {
    try {
      const { data } = await api.get("/student/all");

      return data.students as StudentDTO[];
    } catch (error) {
      throw error;
    }
  }

  async function getStudentById(studentId: number) {
    try {
      const { data } = await api.get(`/student/${studentId}`);

      return data.student as StudentDTO;
    } catch (error) {
      throw error;
    }
  }

  async function createStudent() {
    //
  }

  async function updateStudent() {
    //
  }

  return (
    <StudentContext.Provider value={{ getAllStudent, getStudentById }}>
      {children}
    </StudentContext.Provider>
  );
}
