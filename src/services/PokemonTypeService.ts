// src/services/PokemonTypeService.ts
import type { TypesResponse, PokemonType } from "../types/pokemon";

export class PokemonTypeService {
  private static BASE_URL = "https://pokeapi.co/api/v2";
  private static typeCache = new Map<string, PokemonType>();

  static async getAllTypes(): Promise<TypesResponse> {
    const response = await fetch(`${this.BASE_URL}/type`);
    if (!response.ok) throw new Error("Failed to fetch Pokemon types");
    return response.json();
  }

  static async getTypeDetails(name: string): Promise<PokemonType> {
    if (this.typeCache.has(name)) {
      return this.typeCache.get(name)!;
    }

    const response = await fetch(`${this.BASE_URL}/type/${name}`);
    if (!response.ok)
      throw new Error(`Failed to fetch type details for ${name}`);
    const data = await response.json();

    this.typeCache.set(name, data);
    return data;
  }

  static getBDSPSprite(type: PokemonType): string | null {
    return (
      type.generation_viii?.["brilliant-diamond-and-shining-pearl"]
        ?.front_default || null
    );
  }
}
