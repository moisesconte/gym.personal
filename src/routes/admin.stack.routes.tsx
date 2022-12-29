import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { AdmStudent } from "@screens/admin/adm.student";
import { AdmStudentProfile } from "@screens/admin/adm.student.profile";
import { AdmStudentTrainingSheetList } from "@screens/admin/adm.student.trainingSheetList";
import { AdmStudentTrainingSheet } from "@screens/admin/adm.student.trainingSheet";

import { AdmStudentTraining } from "@screens/admin/adm.student.training";
import { AdmStudentTrainingRegister } from "@screens/admin/adm.student.training.register";
import colors from "native-base/lib/typescript/theme/base/colors";
import { useTheme } from "native-base";

type StudentProfileProps = {
  studentId?: string;
};

type StudentTrainingSheetListProps = {
  studentId?: string;
};

type StudentTrainingSheetProps = {
  trainingSheetId?: string;
  studentId?: string;
};

type StudentTrainingProps = {
  studentId: string;
  trainingGroupId: string;
  trainingGroupName: string;
};

type StudentTrainingRegisterProps = {
  trainingSheetExerciseId?: string;
  trainingGroupId: string;
};

type AdmStackRoutesProps = {
  students: undefined;
  studentProfile: StudentProfileProps;
  studentTrainingSheetList: StudentTrainingSheetListProps;
  studentTrainingSheet: StudentTrainingSheetProps;
  studentTraining: StudentTrainingProps;
  studentTrainingRegister: StudentTrainingRegisterProps;
};

export type AdmStackNavigatorRoutesProps =
  NativeStackNavigationProp<AdmStackRoutesProps>;

const { Navigator, Screen } = createNativeStackNavigator<AdmStackRoutesProps>();

export function AdmStackRoutes() {
  const { sizes, colors, fonts } = useTheme();

  return (
    <Navigator
      initialRouteName="students"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.gray[600],
        },
        headerTitleStyle: {
          color: colors.gray[100],
          fontFamily: fonts.heading,
        },
        headerTitleAlign: "center",
        headerTintColor: colors.gray[100],
        headerBackTitle: "voltar",
      }}
    >
      <Screen
        name="students"
        component={AdmStudent}
        options={{ headerShown: false }}
      />
      <Screen
        name="studentProfile"
        component={AdmStudentProfile}
        options={{
          title: "Perfil do aluno(a)",
        }}
      />
      <Screen
        name="studentTrainingSheetList"
        component={AdmStudentTrainingSheetList}
        options={{
          title: "Fichas do aluno(a)",
        }}
      />
      <Screen
        name="studentTrainingSheet"
        component={AdmStudentTrainingSheet}
        options={{
          title: "Ficha do aluno(a)",
        }}
      />
      <Screen
        name="studentTraining"
        component={AdmStudentTraining}
        options={{
          title: "Treino do aluno(a)",
        }}
      />
      <Screen
        name="studentTrainingRegister"
        component={AdmStudentTrainingRegister}
        options={{
          title: "Cadastro de exercício",
        }}
      />
    </Navigator>
  );
}
