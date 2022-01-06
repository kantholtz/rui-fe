export enum Relations {
  SYNONYM,
  CHILD,
}

export interface Prediction {
  pid: number;
  score: number;
  scoreNorm: number;
  context: string;
  node: Node;
}

export interface Predictions {
  totalSynonyms: number;
  totalChildren: number;
  synonyms: Prediction[];
  children: Prediction[];
}

export interface Annotation {
  nid: number;
  relation: string;
  phrase: string;
  predictedNid: number;
  predictedRelation: string;
  specific: boolean;
}

export interface AnnotationResponse {
  removed: number[];
}

export interface FilterResponse {
  removed: number[];
}
