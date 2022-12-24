export type ExercisesDTO = {
  id: string;
  exercise_id: string;
  repetitions: string;
  series: string;
  trainingGroup_id: string;
  exercise: {
    id: string;
    name: string;
    thumb: string;
    demo: string;
    group: {
      id: string;
      name: string;
    };
  };

  // trainingSheetId: number;
  // repetitions: string;
  // series: number;
  // exercise: {
  //   exerciseId: number;
  //   name: string;
  //   demo: string;
  //   thumb: string;
  //   group: {
  //     groupId: number;
  //     name: string;
  //   };
  // };
};

/**
 * 
 * export type ExercisesDTO = {
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
 */
