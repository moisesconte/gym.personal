export type TrainingSheetExerciseDTO = {
  id: number;
  repetitions: string;
  series: number;
  exercise: {
    id: number;
    name: string;
    demo: string;
    thumb: string;
    group: {
      id: number;
      name: string;
    };
  };
};
