import { Prediction } from "@/models/prediction/prediction";

export interface Predictions {
  candidate: string;
  dismissed: boolean;

  totalScore: number;
  totalScoreNorm: number;

  children: Prediction[];
  synonyms: Prediction[];
}
