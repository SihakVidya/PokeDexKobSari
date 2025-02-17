// src/services/ItemService.ts
import type { Item, Berry, ItemListResponse } from "../types/items";

export class ItemService {
  private static BASE_URL = "https://pokeapi.co/api/v2";
  private static itemCache = new Map<string, Item>();
  private static berryCache = new Map<string, Berry>();

  static async getAllItems(): Promise<Item[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/item?limit=1000`);
      const data: ItemListResponse = await response.json();

      const itemDetails = await Promise.all(
        data.results.map((item) => this.getItemDetail(item.name))
      );

      return itemDetails;
    } catch (error) {
      console.error("Failed to fetch all items:", error);
      throw error;
    }
  }

  static async getAllBerries(): Promise<Berry[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/berry?limit=1000`);
      const data: ItemListResponse = await response.json();

      const berryDetails = await Promise.all(
        data.results.map((berry) => this.getBerryDetail(berry.name))
      );

      return berryDetails;
    } catch (error) {
      console.error("Failed to fetch all berries:", error);
      throw error;
    }
  }

  static async getItemDetail(name: string): Promise<Item> {
    if (this.itemCache.has(name)) {
      return this.itemCache.get(name)!;
    }

    try {
      const response = await fetch(`${this.BASE_URL}/item/${name}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch item details for ${name}`);
      }

      const data = await response.json();

      const item: Item = {
        name: this.formatName(data.name),
        sprite: data.sprites.default,
        category: data.category.name,
        effect:
          data.effect_entries.find((entry: any) => entry.language.name === "en")
            ?.short_effect || "No effect description available",
      };

      this.itemCache.set(name, item);
      return item;
    } catch (error) {
      console.error(`Failed to fetch item detail for ${name}:`, error);
      throw error;
    }
  }

  static async getBerryDetail(name: string): Promise<Berry> {
    if (this.berryCache.has(name)) {
      return this.berryCache.get(name)!;
    }

    try {
      const response = await fetch(`${this.BASE_URL}/berry/${name}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch berry details for ${name}`);
      }

      const data = await response.json();

      const berry: Berry = {
        name: this.formatName(data.name),
        firmness: data.firmness.name,
        flavor: data.flavors[0].flavor.name,
        growth: `${data.growth_time} Hr / Stage`,
        naturalGift: {
          type: data.natural_gift_type.name,
          power: data.natural_gift_power,
        },
      };

      this.berryCache.set(name, berry);
      return berry;
    } catch (error) {
      console.error(`Failed to fetch berry detail for ${name}:`, error);
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
