import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { AdmStudent } from "@screens/adm.student";
import { AdmStudentProfile } from "@screens/adm.student.profile";
import { AdmStudentTrainingSheetList } from "@screens/adm.student.trainingSheetList";
import { AdmStudentTrainingSheet } from "@screens/adm.student.trainingSheet";

import { SignIn } from "@screens/SignIn";
import { AdmStudentTraining } from "@screens/adm.student.training";

type StudentProfileProps = {
  studentId?: number;
};

type StudentTrainingSheetListProps = {
  studentId?: number;
};

type StudentTrainingSheetProps = {
  trainingSheetId?: number;
  studentId?: number;
};

type StudentTrainingProps = {
  studentId: number;
  trainingGroupId: number;
};

type AdmStackRoutesProps = {
  students: undefined;
  studentProfile: StudentProfileProps;
  studentTrainingSheetList: StudentTrainingSheetListProps;
  studentTrainingSheet: StudentTrainingSheetProps;
  studentTraining: StudentTrainingProps;
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
    </Navigator>
  );
}
