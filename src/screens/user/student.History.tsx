import { useEffect, useState } from "react";
import { VStack, SectionList, Heading, Text } from "native-base";

import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { useStudent } from "@hooks/useStudent";
import { useIsFocused } from "@react-navigation/native";
import moment from "moment";

interface IExerciseMarkedAsDoneList {
  groupName: string;
  data: {
    id: string;
    doneAt: string;
    hourAt: string;
    exerciseId: string;
    exerciseName: string;
    exerciseGroupId: string;
    exerciseGroupName: string;
  }[];
}

export function StudentHistory() {
  const [exerciseList, setExerciseList] = useState<IExerciseMarkedAsDoneList[]>(
    []
  );

  const { listExerciseMarkAsDone } = useStudent();
  const isFocused = useIsFocused();

  async function initialScreenLoading() {
    const listExercises = await listExerciseMarkAsDone();

    const listExercisesFormatted = listExercises.map((item) => {
      return {
        id: item.id,
        doneAt: moment(item.done_at).format("LL"),
        hourAt: moment(item.done_at).format("HH:mm"),
        exerciseId: item.exercise.id,
        exerciseName: item.exercise.name,
        exerciseGroupId: item.exercise.group.id,
        exerciseGroupName: item.exercise.group.name,
      };
    });

    const listExercisesGrouped = groupBy(listExercisesFormatted, "doneAt");

    let exerciseListData: IExerciseMarkedAsDoneList[] = [];

    Object.keys(listExercisesGrouped).forEach((key) => {
      exerciseListData.push({
        groupName: key,
        data: listExercisesGrouped[key],
      });
    });

    console.log(exerciseListData);
    setExerciseList(exerciseListData);
  }

  function groupBy(array: any[], key: any) {
    return array.reduce((acc, item) => {
      if (!acc[item[key]]) acc[item[key]] = [];
      acc[item[key]].push(item);
      return acc;
    }, {});
  }

  useEffect(() => {
    initialScreenLoading();
  }, [isFocused]);

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios" />

      <SectionList
        sections={exerciseList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HistoryCard
            exercise={item.exerciseName}
            group={item.exerciseGroupName}
            hour={item.hourAt}
          />
        )}
        renderSectionHeader={({ section }) => (
          <Heading
            color="gray.200"
            fontSize="md"
            fontFamily="heading"
            mt={10}
            mb={3}
          >
            {section.groupName}
          </Heading>
        )}
        px={8}
        contentContainerStyle={
          exerciseList.length === 0 && { flex: 1, justifyContent: "center" }
        }
        ListEmptyComponent={() => (
          <Text color="gray.100" textAlign="center">
            Não há exercícios registrados ainda. {`\n`} Vamos fazer exercícios
            hoje?
          </Text>
        )}
      />
    </VStack>
  );
}
