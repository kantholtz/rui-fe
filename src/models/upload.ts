export interface Available {
  name: string;
  created: string;
  size: number;
}

export interface AvailableResponse {
  available: Available[];
}
