import { Entity, PostNodeEntity } from "@/models/entity";

export interface Node {
  nid: number;
  pid: number | null;
  entities: Entity[];
}

export function getNodeName(node: Node): string {
  return `${node.entities[0].name}`;
}

export interface DeepNode extends Node {
  children: DeepNode[];
}

export interface NodePatch {
  pid: number;
}

export interface PostNode {
  pid: null | number;
  entities: PostNodeEntity[];
}
