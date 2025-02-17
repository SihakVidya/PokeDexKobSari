// src/types/abilities.ts
export interface Ability {
  id: number;
  name: string;
  effect: string;
  shortEffect: string;
  flavorTexts: FlavorText[];
  pokemon: AbilityPokemon[];
}

export interface FlavorText {
  flavorText: string;
  versionGroup: string;
  language: string;
}

export interface AbilityPokemon {
  pokemon: {
    name: string;
    url: string;
  };
  isHidden: boolean;
}

export interface AbilityListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}
