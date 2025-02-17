// src/types/items.ts
export interface Item {
  name: string;
  sprite: string;
  category: string;
  effect: string;
}

export interface Berry {
  name: string;
  firmness: string;
  flavor: string;
  growth: string;
  naturalGift: {
    type: string;
    power: number;
  };
}

export interface ItemListResponse {
  count: number;
  results: {
    name: string;
    url: string;
  }[];
}
