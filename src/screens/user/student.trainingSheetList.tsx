import { CardTrainingSheet } from "@components/CardAdmTrainingSheet";
import { HomeHeader } from "@components/HomeHeader";
import { Loading } from "@components/Loading";
import { ScreenHeader } from "@components/ScreenHeader";
import { useAuth } from "@hooks/useAuth";
import { useStudent } from "@hooks/useStudent";
import { useToast } from "@hooks/useToast";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { AppStackNavigatorRoutesProps } from "@routes/app.stack.routes";
import moment from "moment";
import "moment/locale/pt-br";

import {
  Box,
  Center,
  FlatList,
  Heading,
  HStack,
  Text,
  VStack,
} from "native-base";
import { useEffect, useState } from "react";

interface TrainingSheet {
  id: string;
  name: string;
  createAtFormatted: string;
  isActive: boolean;
}

export function StudentTrainingSheetList() {
  const [trainingSheetList, setTrainingSheetList] = useState<TrainingSheet[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();
  const { findManyTrainingSheet } = useStudent();
  const { handleError, showToast } = useToast();

  const navigation = useNavigation<AppStackNavigatorRoutesProps>();
  const isFocused = useIsFocused();

  function handleOpenStudentTrainingSheet(trainingSheetId: string) {
    navigation.navigate("studentTrainingSheet", { trainingSheetId });
  }

  async function listTrainingSheets() {
    try {
      const { trainingSheets } = await findManyTrainingSheet(user.student_id!);

      setTrainingSheetList(
        trainingSheets.map((item) => {
          return {
            id: item.id,
            name: item.name,
            isActive: !item.canceled_at ? true : false,
            createAtFormatted: moment(item.create_at).utc().format("ll"),
          } as TrainingSheet;
        })
      );
    } catch (error) {
      handleError(error);
    }
  }

  async function initialScreenLoading() {
    try {
      if (user.student_id) {
        await listTrainingSheets();
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    initialScreenLoading();
  }, [isFocused]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1}>
      <HomeHeader />
      
      <VStack p={4} space={4}>
        <Center  pb={4} pt={2}>
          <Heading color="gray.100" fontSize="xl" fontFamily="heading">
            Minhas fichas de treinos
          </Heading>
        </Center>

        <FlatList
          data={trainingSheetList}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <Box h={4} w="full" />}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CardTrainingSheet
              key={item.id}
              {...item}
              onPress={() => handleOpenStudentTrainingSheet(item.id)}
            />
          )}
          ListEmptyComponent={() => (
            <HStack p={4}>
              <Text color="gray.200" textAlign="center" w="full">
                Nenhuma ficha encontrada ou cadastrada.
              </Text>
            </HStack>
          )}
        />
      </VStack>
    </VStack>
  );
}
