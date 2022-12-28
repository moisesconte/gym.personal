import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { AdmStudentProfile } from "@screens/admin/adm.student.profile";

import { StudentTrainingSheetList } from "@screens/user/student.trainingSheetList";
import { StudentTrainingSheet } from "@screens/user/student.trainingSheet";
import { StudentTraining } from "@screens/user/student.training";
import { StudentTrainingRegister } from "@screens/user/student.training.register";

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
}

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
  return (
    <Navigator
      initialRouteName="studentTrainingSheetList"
      screenOptions={{ headerShown: false }}
    >
      <Screen name="studentProfile" component={AdmStudentProfile} />
      <Screen
        name="studentTrainingSheetList"
        component={StudentTrainingSheetList}
      />
      <Screen name="studentTrainingSheet" component={StudentTrainingSheet} />
      <Screen name="studentTraining" component={StudentTraining} />
      <Screen name="studentTrainingRegister" component={StudentTrainingRegister} />
    </Navigator>
  );
}
