export interface IExerciseMarkedAsDoneDTO {
  id: string;
  done_at: Date;

  exercise: {
    id: string;
    name: string;

    group: {
      id: string;
      name: string;
    };
  };
}
