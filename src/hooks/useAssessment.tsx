import { useContext } from "react";

import { AssessmentContext } from "@contexts/AssessmentContext";

export function useAssessment() {
  const context = useContext(AssessmentContext);

  return context;
}
