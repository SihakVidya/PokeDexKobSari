// src/types/types.ts
export interface Type {
  id: number;
  name: string;
  damage_class: {
    name: string;
  };
  generation: {
    name: string;
  };
  damage_relations: {
    double_damage_from: DamageRelation[];
    double_damage_to: DamageRelation[];
    half_damage_from: DamageRelation[];
    half_damage_to: DamageRelation[];
    no_damage_from: DamageRelation[];
    no_damage_to: DamageRelation[];
  };
  pokemon: TypePokemon[];
  moves: TypeMove[];
}

interface DamageRelation {
  name: string;
  url: string;
}

interface TypePokemon {
  pokemon: {
    name: string;
    url: string;
  };
  slot: number;
}

interface TypeMove {
  name: string;
  category: string;
  power: number;
  pp: number;
  accuracy: number;
  effect: string;
}

export interface TypeListResponse {
  count: number;
  results: {
    name: string;
    url: string;
  }[];
}
