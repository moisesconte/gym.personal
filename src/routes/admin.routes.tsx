import { Platform } from "react-native";
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";

import HomeSvg from "@assets/home.svg";
import HistorySvg from "@assets/history.svg";
import ProfileSvg from "@assets/profile.svg";

import { useTheme } from "native-base";
import { AdmHome } from "@screens/adm.home";
import { AdmProfile } from "@screens/adm.Profile";
import { AdmStackRoutes } from "./admin.stack.routes";

type AdminRoutes = {
  home: undefined;
  student: undefined;
  serie: undefined;
  profile: undefined;
  history: undefined;
};

export type AdmNavigatorRoutesProps = BottomTabNavigationProp<AdminRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AdminRoutes>();

export function AdminRoutes() {
  const { sizes, colors } = useTheme();

  const iconSize = sizes[6];

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.green[500],
        tabBarInactiveTintColor: colors.gray[200],
        tabBarStyle: {
          backgroundColor: colors.gray[600],
          borderTopWidth: 0,
          height: Platform.OS === "android" ? "auto" : 96,
          paddingBottom: sizes[10],
          paddingTop: sizes[6],
        },
      }}
    >
      <Screen
        name="home"
        component={AdmHome}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeSvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />

      <Screen
        name="student"
        component={AdmStackRoutes}
        options={{
          tabBarIcon: ({ color }) => (
            <HistorySvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />

      {/* <Screen
        name="serie"
        component={AdmStackRoutes}
        options={{
          tabBarIcon: ({ color }) => (
            <HistorySvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      /> */}

      <Screen
        name="profile"
        component={AdmProfile}
        options={{
          tabBarIcon: ({ color }) => (
            <ProfileSvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />

      {/* <Screen
        name="studentProfile"
        component={AdmStudentProfile}
        options={{ tabBarButton: () => null }}
      /> */}
    </Navigator>
  );
}
