interface AnamnesisDTO {
  id: string;
  student_id: string;
  physical_activity: boolean; //Pratica de atividade física?
  what_physical_activity: string; //qual atividade?
  how_many_times_week: number; //Quantas vezes na semana?
  alcoholic_beverages: boolean; //Consome bebidas alcoólicas?
  smoker: boolean; //Fumante?
  back_problems: boolean; //problemas de coluna?
  high_cholesterol: boolean; //Possuí colesterol alto?
  hdl_cholesterol: number; //Colesterol - HDL?
  ldl_cholesterol: number; //Colesterol - LDL?
  hypertensive: boolean; //É hipertenso (pressão alta) ?
  high_triglycerides: boolean; //Possuí triglicérides alto?
  diabetes: boolean; //É diabético?
  breathing_problems: boolean; //Tem problemas respiratórios?
  what_breathing_problems: string; //Qual?
  cardiac_alteration: boolean; //Possuí alguma alteração cardíaca?
  what_cardiac_alteration: string; //Qual?
  medical_restrictions: boolean; //Alguma recomendação ou restrição médica para prática de exercícios?
  what_medical_restrictions: string; //Qual?
  comments: string; //Gostaria de fazer algum tipo de comentário que possa ajudar na montagem do seu programa de treinamento?
}

interface CreateAnamnesisDTO {
  student_id: string;
  physical_activity: boolean; //Pratica de atividade física?
  what_physical_activity: string; //qual atividade?
  how_many_times_week: number; //Quantas vezes na semana?
  alcoholic_beverages: boolean; //Consome bebidas alcoólicas?
  smoker: boolean; //Fumante?
  back_problems: boolean; //problemas de coluna?
  high_cholesterol: boolean; //Possuí colesterol alto?
  hdl_cholesterol: number; //Colesterol - HDL?
  ldl_cholesterol: number; //Colesterol - LDL?
  hypertensive: boolean; //É hipertenso (pressão alta) ?
  high_triglycerides: boolean; //Possuí triglicérides alto?
  diabetes: boolean; //É diabético?
  breathing_problems: boolean; //Tem problemas respiratórios?
  what_breathing_problems: string; //Qual?
  cardiac_alteration: boolean; //Possuí alguma alteração cardíaca?
  what_cardiac_alteration: string; //Qual?
  medical_restrictions: boolean; //Alguma recomendação ou restrição médica para prática de exercícios?
  what_medical_restrictions: string; //Qual?
  comments: string; //Gostaria de fazer algum tipo de comentário que possa ajudar na montagem do seu programa de treinamento?
}

interface UpdateAnamnesisDTO {
  id: string;
  physical_activity: boolean; //Pratica de atividade física?
  what_physical_activity: string; //qual atividade?
  how_many_times_week: number; //Quantas vezes na semana?
  alcoholic_beverages: boolean; //Consome bebidas alcoólicas?
  smoker: boolean; //Fumante?
  back_problems: boolean; //problemas de coluna?
  high_cholesterol: boolean; //Possuí colesterol alto?
  hdl_cholesterol: number; //Colesterol - HDL?
  ldl_cholesterol: number; //Colesterol - LDL?
  hypertensive: boolean; //É hipertenso (pressão alta) ?
  high_triglycerides: boolean; //Possuí triglicérides alto?
  diabetes: boolean; //É diabético?
  breathing_problems: boolean; //Tem problemas respiratórios?
  what_breathing_problems: string; //Qual?
  cardiac_alteration: boolean; //Possuí alguma alteração cardíaca?
  what_cardiac_alteration: string; //Qual?
  medical_restrictions: boolean; //Alguma recomendação ou restrição médica para prática de exercícios?
  what_medical_restrictions: string; //Qual?
  comments: string; //Gostaria de fazer algum tipo de comentário que possa ajudar na montagem do seu programa de treinamento?
}

export { AnamnesisDTO, CreateAnamnesisDTO, UpdateAnamnesisDTO };
