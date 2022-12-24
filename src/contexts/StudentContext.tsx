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
  student_id: string;
  name: string;
  photo_url?: string;
  birth_date: string;
  genre: string;
  phone?: string;
  email: string;
}

interface FindManyTrainingSheetResponse {
  trainingSheets: {
    id: string;
    name: string;
    canceled_at: Date;
    create_at: Date;
  }[];
}

interface FindTrainingSheetResponse {
  trainingSheet: {
    id: string;
    name: string;
    canceled_at: Date;
    create_at: Date;

    trainingGroup: {
      id: string;
      name: string;
    }[];
  };
}

interface CreateTrainingSheetRequest {
  student_id: string;
  name: string;
}

interface UpdateTrainingSheetRequest {
  trainingSheetId: string;
  name: string;
  actived: boolean;
}

interface UpdateTrainingSheetResponse {
  id: string;
  name: string;
  canceled_at: Date;
  create_at: Date;

  trainingGroup: {
    id: string;
    name: string;
  }[];
}

interface FindExercisesByTrainingGroupIdRequest {
  trainingGroupId: string;
}

interface FindExerciseByTrainingSheetExerciseIdRequest {
  trainingSheetExerciseId: string;
}

interface TrainingExerciseRequest {
  series: string;
  repetitions: string;
  trainingGroupId: string;
  exerciseId: string;
}

export type StudentContextProps = {
  getAllStudent: () => Promise<StudentDTO[]>;
  getStudentById: (studentId: string) => Promise<StudentDTO>;
  createStudent: (request: CreateStudentRequest) => Promise<void>;
  updateStudent: (request: UpdateStudentRequest) => Promise<void>;
  updateAvatar: (
    studentId: string,
    avatarUploadForm: FormData
  ) => Promise<StudentDTO>;
  findManyTrainingSheet: (
    studentId: string
  ) => Promise<FindManyTrainingSheetResponse>;
  findTrainingSheetById: (
    trainingSheetId: string
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
  findExerciseAvailableList: (
    exerciseGroupId: string,
    trainingGroupId: string
  ) => Promise<ExerciseListDTO[]>;
  trainingExerciseAdd: (request: TrainingExerciseRequest) => Promise<void>;
  trainingExerciseRemove: (exerciseId: string) => Promise<void>;
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
      const { data } = await api.get("/student/list");

      return data?.students as StudentDTO[];
    } catch (error) {
      throw error;
    }
  }

  async function getStudentById(studentId: string) {
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

  async function updateAvatar(studentId: string, avatarUploadForm: FormData) {
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

  //TODO: separar em uma nova contextAPI...

  async function findManyTrainingSheet(studentId: string) {
    try {
      const { data } = await api.get(`/training-sheet/list/${studentId}`);

      return {
        trainingSheets: data.trainingSheets,
      } as FindManyTrainingSheetResponse;
    } catch (error) {
      throw error;
    }
  }

  async function findTrainingSheetById(trainingSheetId: string) {
    try {
      const { data } = await api.get(`/training-sheet/find/${trainingSheetId}`);

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
        `/training-sheet/list-exercises/${trainingGroupId}`
      );

      return data.trainingSheetExercises as ExercisesDTO[];
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
        `/training-sheet/find-exercise/${trainingSheetExerciseId}`
      );

      return data.trainingSheetExercise as TrainingSheetExerciseDTO;
      //
    } catch (error) {
      throw error;
    }
  }

  async function trainingExerciseAdd(request: TrainingExerciseRequest) {
    try {
      await api.post("/training-sheet/exercise/add", { ...request });

      return;
    } catch (error) {
      throw error;
    }
  }

  async function trainingExerciseRemove(exerciseId: string) {
    try {
      await api.post("/training-sheet/exercise/remove", { exerciseId });

      return;
    } catch (error) {
      throw error;
    }
  }

  //TODO: separar em uma nova contextAPI...
  async function findExerciseGroupList() {
    try {
      const { data } = await api.get("/exercise-group/list");

      return data.exerciseGroups as ExcerciseGroupDTO[];
    } catch (error) {
      throw error;
    }
  }

  //TODO: separar em uma nova contextAPI...
  async function findExerciseListByGroupId(groupId: string) {
    try {
      const { data } = await api.get(`/exercise/list/${groupId}`);

      return data.exercises as ExerciseListDTO[];
    } catch (error) {
      throw error;
    }
  }

  async function findExerciseAvailableList(
    exerciseGroupId: string,
    trainingGroupId: string
  ) {
    try {
      const { data } = await api.get(
        `/exercise/list-available-per/${exerciseGroupId}/and/${trainingGroupId}`
      );

      return data.exercises as ExerciseListDTO[];
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
        findExerciseAvailableList,
        trainingExerciseAdd,
        trainingExerciseRemove
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}
