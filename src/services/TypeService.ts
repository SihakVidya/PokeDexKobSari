// src/services/TypeService.ts
import type { Type, TypeListResponse } from "../types/types";

export class TypeService {
  private static BASE_URL = "https://pokeapi.co/api/v2";
  private static typeCache = new Map<string, Type>();

  static async getAllTypes(): Promise<Type[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/type`);
      const data: TypeListResponse = await response.json();

      const types = await Promise.all(
        data.results.map((type) => this.getTypeDetail(type.name))
      );

      return types;
    } catch (error) {
      console.error("Failed to fetch types:", error);
      throw error;
    }
  }

  static async getTypeDetail(name: string): Promise<Type> {
    if (this.typeCache.has(name)) {
      return this.typeCache.get(name)!;
    }

    try {
      const response = await fetch(`${this.BASE_URL}/type/${name}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch type details for ${name}`);
      }

      const data = await response.json();
      this.typeCache.set(name, data);
      return data;
    } catch (error) {
      console.error(`Failed to fetch type detail for ${name}:`, error);
      throw error;
    }
  }

  static getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      normal: "bg-gray-400",
      fire: "bg-pokemon-red",
      water: "bg-blue-500",
      electric: "bg-pokemon-yellow",
      grass: "bg-green-500",
      ice: "bg-blue-300",
      fighting: "bg-red-700",
      poison: "bg-purple-500",
      ground: "bg-yellow-700",
      flying: "bg-indigo-300",
      psychic: "bg-pink-500",
      bug: "bg-lime-500",
      rock: "bg-yellow-800",
      ghost: "bg-purple-700",
      dragon: "bg-indigo-600",
      dark: "bg-gray-700",
      steel: "bg-gray-500",
      fairy: "bg-pink-300",
    };

    return colors[type] || "bg-gray-400";
  }
}
