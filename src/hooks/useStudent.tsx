import { useContext } from "react";

import { StudentContext } from "@contexts/StudentContext";

export function useStudent() {
  const context = useContext(StudentContext);

  return context;
}
