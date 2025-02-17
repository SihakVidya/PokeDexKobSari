// src/services/AbilityService.ts
import type { Ability, AbilityListResponse } from "../types/abilities";

export class AbilityService {
  private static BASE_URL = "https://pokeapi.co/api/v2";
  private static abilityCache = new Map<string, Ability>();

  static async getAllAbilities(
    page: number = 1,
    limit: number = 20
  ): Promise<{ abilities: Ability[]; total: number }> {
    try {
      const offset = (page - 1) * limit;
      const response = await fetch(
        `${this.BASE_URL}/ability?offset=${offset}&limit=${limit}`
      );
      const data: AbilityListResponse = await response.json();

      const abilities = await Promise.all(
        data.results.map((ability) => this.getAbilityDetail(ability.name))
      );

      return {
        abilities,
        total: data.count,
      };
    } catch (error) {
      console.error("Failed to fetch abilities:", error);
      throw error;
    }
  }

  static async getAbilityDetail(name: string): Promise<Ability> {
    const formattedName = name.toLowerCase().replace(/\s+/g, "-");
    if (this.abilityCache.has(formattedName)) {
      return this.abilityCache.get(formattedName)!;
    }

    try {
      const response = await fetch(`${this.BASE_URL}/ability/${formattedName}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ability details for ${name}`);
      }

      const data = await response.json();

      const ability: Ability = {
        id: data.id,
        name: this.formatName(data.name),
        effect:
          data.effect_entries.find((entry: any) => entry.language.name === "en")
            ?.effect || "",
        shortEffect:
          data.effect_entries.find((entry: any) => entry.language.name === "en")
            ?.short_effect || "",
        flavorTexts: data.flavor_text_entries
          .filter((entry: any) => entry.language.name === "en")
          .map((entry: any) => ({
            flavorText: entry.flavor_text,
            versionGroup: entry.version_group.name,
            language: entry.language.name,
          })),
        pokemon: data.pokemon.map((p: any) => ({
          pokemon: p.pokemon,
          isHidden: p.is_hidden,
        })),
      };

      this.abilityCache.set(name, ability);
      return ability;
    } catch (error) {
      console.error(`Failed to fetch ability detail for ${name}:`, error);
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
