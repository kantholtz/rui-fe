export enum Relations {
  SYNONYM,
  CHILD,
}

export interface Prediction {
  pid: number;
  nid: number;
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
