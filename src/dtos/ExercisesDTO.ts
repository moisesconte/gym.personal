export type ExercisesDTO = {
  trainingSheetId: number;
  repetitions: string;
  series: number;
  exercise: {
    exerciseId: number;
    name: string;
    demo: string;
    thumb: string;
    group: {
      groupId: number;
      name: string;
    };
  };
};