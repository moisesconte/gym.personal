import { useTheme, Box } from "native-base";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";

import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";
import { useAuth } from "@hooks/useAuth";
import { AdminRoutes } from "./admin.routes";
import { Loading } from "@components/Loading";

export function Routes() {
  const { colors } = useTheme();
  const { user, isLoadingUserStorageData } = useAuth();

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

  if (isLoadingUserStorageData) {
    return <Loading />;
  }

  if (user.role === "admin") {
    return (
      <Box flex={1} bg="gray.700">
        <NavigationContainer theme={theme}>
          <AdminRoutes />
        </NavigationContainer>
      </Box>
    );
  }

  if (user.role === "user") {
    return (
      <Box flex={1} bg="gray.700">
        <NavigationContainer theme={theme}>
          <AppRoutes />
        </NavigationContainer>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="gray.700">
      <NavigationContainer theme={theme}>
        <AuthRoutes />
      </NavigationContainer>
    </Box>
  );
}
