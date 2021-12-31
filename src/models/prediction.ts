export interface Prediction {
  score: number;
  scoreNorm: number;
  context: string;
  node: Node;
}

export interface PredictionResponse {
  totalSynonyms: number;
  totalChildren: number;
  synonyms: Prediction[];
  children: Prediction[];
}
