import { useContext } from "react";

import { AnamnesisContext } from "@contexts/AnamnesisContext";


export function useAnamnesis() {
  const context = useContext(AnamnesisContext);

  return context;
}
