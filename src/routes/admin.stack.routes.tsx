import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { AdmStudent } from "@screens/adm.student";
import { AdmStudentProfile } from "@screens/adm.student.profile";
import { AdmStudentTrainingSheetList } from "@screens/adm.student.trainingSheetList";
import { AdmStudentTrainingSheet } from "@screens/adm.student.trainingSheet";

import { AdmStudentTraining } from "@screens/adm.student.training";
import { AdmStudentTrainingRegister } from "@screens/adm.student.training.register";

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
  return (
    <Navigator
      initialRouteName="students"
      screenOptions={{ headerShown: false }}
    >
      <Screen name="students" component={AdmStudent} />
      <Screen name="studentProfile" component={AdmStudentProfile} />
      <Screen
        name="studentTrainingSheetList"
        component={AdmStudentTrainingSheetList}
      />
      <Screen name="studentTrainingSheet" component={AdmStudentTrainingSheet} />
      <Screen name="studentTraining" component={AdmStudentTraining} />
      <Screen name="studentTrainingRegister" component={AdmStudentTrainingRegister} />
    </Navigator>
  );
}
