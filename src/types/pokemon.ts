// src/types/pokemon.ts
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}
// Removed duplicate PokemonDetail interface

export interface PokemonType {
  id: number;
  name: string;
  generation: {
    name: string;
    url: string;
  };
  generation_v: {
    "black-white": {
      animated: {
        back_default: string | null;
        back_female: string | null;
        back_shiny: string | null;
        back_shiny_female: string | null;
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
      };
    };
  };
  generation_viii: {
    "brilliant-diamond-and-shining-pearl": {
      front_default: string | null;
      front_female: string | null;
      front_shiny: string | null;
      front_shiny_female: string | null;
    };
  };
}

export interface TypesResponse {
  count: number;
  results: {
    name: string;
    url: string;
  }[];
}

export interface PokemonSpecies {
  flavor_text_entries: FlavorTextEntry[];
  evolution_chain: {
    url: string;
  };
  shape: {
    name: string;
    url: string;
  };
  color: {
    name: string;
    url: string;
  };
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: {
    name: string;
    url: string;
  };
  version: {
    name: string;
    url: string;
  };
}

export interface EvolutionChain {
  chain: ChainLink;
}

export interface ChainLink {
  species: {
    name: string;
    url: string;
  };
  evolves_to: ChainLink[];
}

// Helper interface for the evolution display
export interface ProcessedEvolution {
  id: number;
  name: string;
  sprite: string;
}

// Update PokemonDetail interface to include stats
export interface PokemonDetail {
  height: number;
  weight: number;
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
  id: number;
  name: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
}
