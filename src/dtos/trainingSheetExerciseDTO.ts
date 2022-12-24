export type TrainingSheetExerciseDTO = {
  id: string;
  repetitions: string;
  series: string;
  trainingGroup_id: string;
  exercise_id: string;
  exercise: {
    id: string;
    name: string;
    demo: string;
    thumb: string;
    group: {
      id: string;
      name: string;
    };
  };
};
