import { Predictions } from "@/models/prediction/predictions";

export interface PredictionResponse {
  totalPredictions: number;
  totalSynonymPredictions: number;
  totalChildPredictions: number;
  predictions: Predictions[];
}
