import { Node } from "@/models/node/node";

export interface Prediction {
  score: number;
  scoreNorm: number;
  node: Node;
}
