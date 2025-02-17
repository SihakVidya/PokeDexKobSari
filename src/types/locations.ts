// src/types/locations.ts
export interface Location {
  id: number;
  name: string;
  region: string;
  generation: number;
  areas: LocationArea[];
  encounters?: EncounterMethod[];
}

export interface LocationArea {
  name: string;
  url: string;
}

export interface EncounterMethod {
  method: string;
  description: string;
  pokemon: PokemonEncounter[];
}

export interface PokemonEncounter {
  pokemon: {
    name: string;
    sprite: string;
  };
  games: string[];
  rarity: number;
  levels: string;
  seasons?: string[];
}

export interface LocationListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}
