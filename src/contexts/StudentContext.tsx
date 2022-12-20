import { ExcerciseGroupDTO } from "@dtos/ExerciseGroupDTO";
import { ExerciseListDTO } from "@dtos/ExerciseListDTO";
import { ExercisesDTO } from "@dtos/ExercisesDTO";
import { StudentDTO } from "@dtos/StudentDTO";
import { TrainingSheetExerciseDTO } from "@dtos/trainingSheetExerciseDTO";
import { api } from "@services/api";
import { createContext, ReactNode } from "react";

interface CreateStudentRequest {
  name: string;
  photo_url?: string;
  birth_date: string;
  genre: string;
  phone?: string;
  email: string;
}

interface UpdateStudentRequest {
  student_id: number;
  name: string;
  photo_url?: string;
  birth_date: string;
  genre: string;
  phone?: string;
  email: string;
}

interface FindManyTrainingSheetResponse {
  trainingSheets: {
    id: number;
    name: string;
    canceled_at: Date;
    create_at: Date;
  }[];
}

interface FindTrainingSheetResponse {
  trainingSheet: {
    id: number;
    name: string;
    canceled_at: Date;
    create_at: Date;

    trainingGroup: {
      id: number;
      name: string;
    }[];
  };
}

interface CreateTrainingSheetRequest {
  student_id: number;
  name: string;
}

interface UpdateTrainingSheetRequest {
  trainingSheetId: number;
  name: string;
  actived: boolean;
}

interface UpdateTrainingSheetResponse {
  id: number;
  name: string;
  canceled_at: Date;
  create_at: Date;

  trainingGroup: {
    id: number;
    name: string;
  }[];
}

interface FindExercisesByTrainingGroupIdRequest {
  trainingGroupId: string;
}

interface FindExerciseByTrainingSheetExerciseIdRequest {
  trainingSheetExerciseId: number;
}

interface TrainingExerciseRequest {
  series: number;
  repetitions: string;
  trainingGroupId: number;
  exerciseId: number;
}

export type StudentContextProps = {
  getAllStudent: () => Promise<StudentDTO[]>;
  getStudentById: (studentId: number) => Promise<StudentDTO>;
  createStudent: (request: CreateStudentRequest) => Promise<void>;
  updateStudent: (request: UpdateStudentRequest) => Promise<void>;
  updateAvatar: (
    studentId: number,
    avatarUploadForm: FormData
  ) => Promise<StudentDTO>;
  findManyTrainingSheet: (
    studentId: number
  ) => Promise<FindManyTrainingSheetResponse>;
  findTrainingSheetById: (
    trainingSheetId: number
  ) => Promise<FindTrainingSheetResponse>;
  createTrainingSheet: (request: CreateTrainingSheetRequest) => Promise<void>;
  updateTrainingSheet: (
    request: UpdateTrainingSheetRequest
  ) => Promise<UpdateTrainingSheetResponse>;
  findExercisesByTrainingGroupId: (
    request: FindExercisesByTrainingGroupIdRequest
  ) => Promise<ExercisesDTO[]>;
  findExerciseByTrainingSheetExerciseId: (
    request: FindExerciseByTrainingSheetExerciseIdRequest
  ) => Promise<TrainingSheetExerciseDTO>;
  findExerciseGroupList: () => Promise<ExcerciseGroupDTO[]>;
  findExerciseListByGroupId: (groupId: string) => Promise<ExerciseListDTO[]>;
  trainingExerciseAdd: (request: TrainingExerciseRequest) => Promise<void>;
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
  //
  async function getAllStudent() {
    try {
      const { data } = await api.get("/student/all");

      return data?.students as StudentDTO[];
    } catch (error) {
      throw error;
    }
  }

  async function getStudentById(studentId: number) {
    try {
      const { data } = await api.get(`/student/find/${studentId}`);

      return data?.student as StudentDTO;
    } catch (error) {
      throw error;
    }
  }

  async function createStudent(request: CreateStudentRequest) {
    try {
      await api.post("/student/create", {
        ...request,
      });
    } catch (error) {
      throw error;
    }
  }

  async function updateStudent(request: UpdateStudentRequest) {
    try {
      await api.post("/student/update", {
        ...request,
      });
    } catch (error) {
      throw error;
    }
  }

  async function updateAvatar(studentId: number, avatarUploadForm: FormData) {
    try {
      const response = await api.patch(
        `/student/avatar/${studentId}`,
        avatarUploadForm,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data?.student;
    } catch (error) {
      throw error;
    }
  }

  async function findManyTrainingSheet(studentId: number) {
    try {
      const { data } = await api.get(
        `/training-sheet/many/from/${Number(studentId)}`
      );

      return {
        trainingSheets: data.trainingSheets,
      } as FindManyTrainingSheetResponse;
    } catch (error) {
      throw error;
    }
  }

  async function findTrainingSheetById(trainingSheetId: number) {
    try {
      const { data } = await api.get(`/training-sheet/from/${trainingSheetId}`);

      return {
        trainingSheet: data.trainingSheet,
      } as FindTrainingSheetResponse;
    } catch (error) {
      throw error;
    }
  }

  async function createTrainingSheet(request: CreateTrainingSheetRequest) {
    try {
      await api.post("/training-sheet/create", {
        ...request,
      });
      return;
    } catch (error) {
      throw error;
    }
  }

  async function updateTrainingSheet(request: UpdateTrainingSheetRequest) {
    try {
      const { data } = await api.post("/training-sheet/update", {
        ...request,
      });

      return data.trainingSheet as UpdateTrainingSheetResponse;
    } catch (error) {
      throw error;
    }
  }

  async function findExercisesByTrainingGroupId(
    request: FindExercisesByTrainingGroupIdRequest
  ) {
    try {
      const { trainingGroupId } = request;

      const { data } = await api.get(
        `/training-sheet/exercises/from/${trainingGroupId}`
      );

      return data.exercises as ExercisesDTO[];
      //
    } catch (error) {
      throw error;
    }
  }

  async function findExerciseByTrainingSheetExerciseId(
    request: FindExerciseByTrainingSheetExerciseIdRequest
  ) {
    try {
      const { trainingSheetExerciseId } = request;

      const { data } = await api.get(
        `/training-sheet/exercise/from/${trainingSheetExerciseId}`
      );

      return data.exercise as TrainingSheetExerciseDTO;
      //
    } catch (error) {
      throw error;
    }
  }

  async function findExerciseGroupList() {
    try {
      const { data } = await api.get("/training-sheet/exercise-groups");

      return data.exerciseGroups as ExcerciseGroupDTO[];
    } catch (error) {
      throw error;
    }
  }

  async function findExerciseListByGroupId(groupId: string) {
    try {
      const { data } = await api.get(
        `/training-sheet/exercise-list/from/${groupId}`
      );

      return data.exercises as ExerciseListDTO[];
    } catch (error) {
      throw error;
    }
  }

  async function trainingExerciseAdd(request: TrainingExerciseRequest) {
    try {
      await api.post("/training-sheet/exercise/create", { ...request });

      return;
    } catch (error) {
      throw error;
    }
  }

  return (
    <StudentContext.Provider
      value={{
        getAllStudent,
        getStudentById,
        createStudent,
        updateStudent,
        updateAvatar,
        findManyTrainingSheet,
        findTrainingSheetById,
        createTrainingSheet,
        updateTrainingSheet,
        findExercisesByTrainingGroupId,
        findExerciseByTrainingSheetExerciseId,
        findExerciseGroupList,
        findExerciseListByGroupId,
        trainingExerciseAdd,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}
