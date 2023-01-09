import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { ForgotPassword } from "@screens/shared/forgotPassword";

import { SignIn } from "@screens/shared/SignIn";

type AuthRoutes = {
  signIn: undefined;
  forgotPassword: undefined;
};

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>();

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="signIn" component={SignIn} />
      <Screen name="forgotPassword" component={ForgotPassword} />
    </Navigator>
  );
}
