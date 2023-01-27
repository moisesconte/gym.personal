import { StatusBar } from "react-native";
import { THEME } from "./src/theme";
import { NativeBaseProvider } from "native-base";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { Loading } from "@components/Loading";
import { Routes } from "@routes/index";
import { AuthContextProvider } from "@contexts/AuthContext";
import { StudentContextProvider } from "@contexts/StudentContext";
import { ToastContextProvider } from "@contexts/ToastContext";
import { AnamnesisContextProvider } from "@contexts/AnamnesisContext";
import { AssessmentContextProvider } from "@contexts/AssessmentContext";

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <ToastContextProvider>
        <AuthContextProvider>
          <StudentContextProvider>
            <AnamnesisContextProvider>
              <AssessmentContextProvider>
                {fontsLoaded ? <Routes /> : <Loading />}
              </AssessmentContextProvider>
            </AnamnesisContextProvider>
          </StudentContextProvider>
        </AuthContextProvider>
      </ToastContextProvider>
    </NativeBaseProvider>
  );
}
