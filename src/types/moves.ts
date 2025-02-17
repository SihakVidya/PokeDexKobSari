// src/types/moves.ts
export interface Move {
  name: string;
  type: string;
  category: string;
  power: number;
  pp: number;
  accuracy: number;
  effect: string;
}

export interface MoveListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}
