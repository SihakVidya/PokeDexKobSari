// src/services/MovesService.ts
import type { Move, MoveListResponse } from "../types/moves";

export class MovesService {
  private static BASE_URL = "https://pokeapi.co/api/v2";
  private static movesCache = new Map<string, Move>();

  static async getAllMoves(): Promise<Move[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/move?limit=1000`);
      const data: MoveListResponse = await response.json();

      const moveDetails = await Promise.all(
        data.results.map((move) => this.getMoveDetail(move.name))
      );

      return moveDetails;
    } catch (error) {
      console.error("Failed to fetch all moves:", error);
      throw error;
    }
  }

  static async getMoveDetail(name: string): Promise<Move> {
    if (this.movesCache.has(name)) {
      return this.movesCache.get(name)!;
    }

    try {
      const response = await fetch(`${this.BASE_URL}/move/${name}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch move details for ${name}`);
      }

      const data = await response.json();

      const move: Move = {
        name: this.formatName(data.name),
        type: data.type.name,
        category: data.damage_class.name,
        power: data.power || 0,
        pp: data.pp,
        accuracy: data.accuracy || 0,
        effect:
          data.effect_entries[0]?.short_effect ||
          "No effect description available",
      };

      this.movesCache.set(name, move);
      return move;
    } catch (error) {
      console.error(`Failed to fetch move detail for ${name}:`, error);
      throw error;
    }
  }

  private static formatName(name: string): string {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}
