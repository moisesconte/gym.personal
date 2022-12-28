import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { AdmStudentProfile } from "@screens/admin/adm.student.profile";

import { StudentTrainingSheetList } from "@screens/user/student.trainingSheetList";
import { StudentTrainingSheet } from "@screens/user/student.trainingSheet";
import { StudentTraining } from "@screens/user/student.training";
import { StudentTrainingRegister } from "@screens/user/student.training.register";
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

type AppStackRoutesProps = {
  students: undefined;
  studentProfile: StudentProfileProps;
  studentTrainingSheetList: StudentTrainingSheetListProps;
  studentTrainingSheet: StudentTrainingSheetProps;
  studentTraining: StudentTrainingProps;
  studentTrainingRegister: StudentTrainingRegisterProps;
};

export type AppStackNavigatorRoutesProps =
  NativeStackNavigationProp<AppStackRoutesProps>;

const { Navigator, Screen } = createNativeStackNavigator<AppStackRoutesProps>();

export function AppStackRoutes() {
  const { sizes, colors, fonts } = useTheme();

  return (
    <Navigator
      initialRouteName="studentTrainingSheetList"
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
      }}
    >
      <Screen name="studentProfile" component={AdmStudentProfile} />
      <Screen
        name="studentTrainingSheetList"
        component={StudentTrainingSheetList}
        options={{ headerShown: false }}
      />
      <Screen
        name="studentTrainingSheet"
        component={StudentTrainingSheet}
        options={{
          title: "Ficha do aluno(a)",
        }}
      />
      <Screen
        name="studentTraining"
        component={StudentTraining}
        options={{
          title: "Meus treinos",
        }}
      />
      <Screen
        name="studentTrainingRegister"
        component={StudentTrainingRegister}
        options={{
          title: "Detalhes do treino",
        }}
      />
    </Navigator>
  );
}
