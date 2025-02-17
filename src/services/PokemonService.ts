// src/services/PokemonService.ts
import type { PokemonListResponse, PokemonDetail } from "../types/pokemon";

export class PokemonService {
  private static BASE_URL = "https://pokeapi.co/api/v2";
  private static pokemonCache = new Map<string, PokemonDetail>();

  static async getAllPokemon(): Promise<PokemonDetail[]> {
    try {
      // First, get the total count of Pokemon
      const response = await fetch(`${this.BASE_URL}/pokemon?limit=1`);
      const data: PokemonListResponse = await response.json();

      // Fetch all Pokemon
      const allPokemonResponse = await fetch(
        `${this.BASE_URL}/pokemon?limit=${data.count}`
      );
      const allPokemonData: PokemonListResponse =
        await allPokemonResponse.json();

      // Fetch details for all Pokemon
      const pokemonDetails = await Promise.all(
        allPokemonData.results.map((pokemon) =>
          this.getPokemonDetail(pokemon.name)
        )
      );

      return pokemonDetails;
    } catch (error) {
      console.error("Failed to fetch all Pokemon:", error);
      throw error;
    }
  }

  static async getPokemonDetail(
    nameOrId: string | number
  ): Promise<PokemonDetail> {
    const cacheKey = String(nameOrId);

    if (this.pokemonCache.has(cacheKey)) {
      return this.pokemonCache.get(cacheKey)!;
    }

    const response = await fetch(`${this.BASE_URL}/pokemon/${nameOrId}`);
    if (!response.ok)
      throw new Error(`Failed to fetch Pokemon details for ${nameOrId}`);

    const data = await response.json();
    this.pokemonCache.set(cacheKey, data);
    return data;
  }

  static async getPokemonSpecies(id: number): Promise<any> {
    try {
      const response = await fetch(`${this.BASE_URL}/pokemon-species/${id}`);
      if (!response.ok)
        throw new Error(`Failed to fetch Pokemon species for ${id}`);
      return response.json();
    } catch (error) {
      console.error("Failed to fetch Pokemon species:", error);
      throw error;
    }
  }

  static async getEvolutionChain(url: string): Promise<any> {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch evolution chain");
      return response.json();
    } catch (error) {
      console.error("Failed to fetch evolution chain:", error);
      throw error;
    }
  }
}
