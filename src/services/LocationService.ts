// src/services/LocationService.ts
import type {
  Location,
  LocationListResponse,
  LocationArea,
  EncounterMethod,
  PokemonEncounter,
} from "../types/locations";

export class LocationService {
  private static BASE_URL = "https://pokeapi.co/api/v2";
  private static locationCache = new Map<string, Location>();

  static async getLocationsByRegion(region: string): Promise<Location[]> {
    try {
      // First, get all locations
      const response = await fetch(`${this.BASE_URL}/location?limit=1000`);
      const data: LocationListResponse = await response.json();

      // Fetch full details for each location
      const locations = await Promise.all(
        data.results.map(async (loc) => {
          try {
            const locationResponse = await fetch(loc.url);
            const locationData = await locationResponse.json();

            // Only return locations that match the requested region
            if (
              locationData.region?.name.toLowerCase() === region.toLowerCase()
            ) {
              return {
                id: locationData.id,
                name: this.getLocalizedName(locationData.names, "en"),
                region: this.formatName(locationData.region.name),
                generation: this.getGenerationNumber(
                  locationData.game_indices[0]?.generation?.name || ""
                ),
                areas: locationData.areas.map((area: any) => ({
                  name: this.formatName(area.name),
                  url: area.url,
                })),
              };
            }
            return null;
          } catch (error) {
            console.error(
              `Failed to fetch details for location ${loc.name}:`,
              error
            );
            return null;
          }
        })
      );

      // Filter out null values and sort by name
      return locations
        .filter((loc): loc is Location => loc !== null)
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error("Failed to fetch locations:", error);
      throw error;
    }
  }

  static async getLocationDetail(locationId: number): Promise<Location> {
    const cacheKey = String(locationId);
    if (this.locationCache.has(cacheKey)) {
      return this.locationCache.get(cacheKey)!;
    }

    try {
      // Fetch main location data
      const locationResponse = await fetch(
        `${this.BASE_URL}/location/${locationId}`
      );
      if (!locationResponse.ok) {
        throw new Error(
          `Failed to fetch location details for ID ${locationId}`
        );
      }
      const locationData = await locationResponse.json();

      // Fetch all area data for the location
      const areaPromises = locationData.areas.map(async (area: any) => {
        const areaResponse = await fetch(area.url);
        if (!areaResponse.ok) {
          throw new Error(`Failed to fetch area details for ${area.name}`);
        }
        return areaResponse.json();
      });

      const areasData = await Promise.all(areaPromises);

      // Process encounters from all areas
      const allEncounters = areasData.flatMap(
        (area) => area.pokemon_encounters
      );
      const processedEncounters = this.processEncounters(allEncounters);

      const location: Location = {
        id: locationData.id,
        name: this.getLocalizedName(locationData.names, "en"),
        region: this.formatName(locationData.region.name),
        generation: this.getGenerationNumber(
          locationData.game_indices[0]?.generation?.name || ""
        ),
        areas: locationData.areas.map((area: any) => ({
          name: this.formatName(area.name),
          url: area.url,
        })),
        encounters: processedEncounters,
      };

      this.locationCache.set(cacheKey, location);
      return location;
    } catch (error) {
      console.error(
        `Failed to fetch location detail for ${locationId}:`,
        error
      );
      throw error;
    }
  }

  private static getLocalizedName(names: any[], language: string): string {
    const localizedName = names.find((name) => name.language.name === language);
    return localizedName ? localizedName.name : "";
  }

  private static formatName(name: string): string {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  private static getGenerationNumber(genName: string): number {
    const genMatch = genName.match(/generation-(\w+)/);
    if (!genMatch) return 0;

    const romanNumerals: { [key: string]: number } = {
      i: 1,
      ii: 2,
      iii: 3,
      iv: 4,
      v: 5,
      vi: 6,
      vii: 7,
      viii: 8,
      ix: 9,
    };

    return romanNumerals[genMatch[1]] || 0;
  }

  private static processEncounters(encounters: any[]): EncounterMethod[] {
    try {
      const methodGroups = new Map<string, PokemonEncounter[]>();

      encounters.forEach((encounter) => {
        encounter.version_details.forEach((versionDetail: any) => {
          versionDetail.encounter_details.forEach((detail: any) => {
            const method = detail.method.name;
            const methodKey = this.formatEncounterMethod(method);

            if (!methodGroups.has(methodKey)) {
              methodGroups.set(methodKey, []);
            }

            const gameName = this.formatName(versionDetail.version.name);
            const gameGen = this.getGameGeneration(versionDetail.version.name);
            const gameInfo = `${gameName} (${gameGen})`;

            // Calculate rarity based on encounter chance
            const rarity = detail.chance || 0;

            // Format level range
            const minLevel = detail.min_level;
            const maxLevel = detail.max_level;
            const levels =
              minLevel === maxLevel ? `${minLevel}` : `${minLevel}-${maxLevel}`;

            // Get seasons if available
            const seasons =
              detail.condition_values
                ?.filter((condition: any) => condition.name.includes("season"))
                ?.map((condition: any) =>
                  this.formatName(condition.name.replace("-season", ""))
                ) || [];

            const pokemon: PokemonEncounter = {
              pokemon: {
                name: encounter.pokemon.name,
                sprite: this.getPokemonSprite(encounter.pokemon.url),
              },
              games: [gameInfo],
              rarity,
              levels,
              ...(seasons.length && { seasons }),
            };

            const existingPokemon = methodGroups
              .get(methodKey)
              ?.find((p) => p.pokemon.name === pokemon.pokemon.name);

            if (existingPokemon) {
              if (!existingPokemon.games.includes(gameInfo)) {
                existingPokemon.games.push(gameInfo);
              }
              existingPokemon.rarity = Math.max(existingPokemon.rarity, rarity);
            } else {
              methodGroups.get(methodKey)?.push(pokemon);
            }
          });
        });
      });

      return Array.from(methodGroups.entries()).map(([method, pokemon]) => ({
        method: this.formatName(method),
        description: this.getMethodDescription(method),
        pokemon: pokemon.sort((a, b) => b.rarity - a.rarity),
      }));
    } catch (error) {
      console.error("Error processing encounters:", error);
      return [];
    }
  }

  private static formatEncounterMethod(method: string): string {
    const methodMapping: { [key: string]: string } = {
      walk: "walking",
      "walk-grass": "walking",
      "old-rod": "fishing",
      "good-rod": "fishing",
      "super-rod": "fishing",
      surf: "surfing",
      "rock-smash": "rock-smash",
      headbutt: "headbutt",
      "cave-spots": "cave",
      "ground-spots": "ground",
      "dark-grass": "dark-grass",
      gift: "gift",
      purchase: "purchase",
    };

    return methodMapping[method] || method;
  }

  private static getMethodDescription(method: string): string {
    const descriptions: { [key: string]: string } = {
      walking: "Found by walking in grass or a cave",
      fishing: "Found by fishing with a rod",
      surfing: "Found while surfing on water",
      "rock-smash": "Found by breaking rocks",
      headbutt: "Found by headbutting trees",
      cave: "Found in cave areas",
      ground: "Found on the ground",
      "dark-grass": "Found in dark grass patches",
      gift: "Received as a gift",
      purchase: "Available for purchase",
    };

    return descriptions[method] || "Found in the wild";
  }

  private static getPokemonSprite(url: string): string {
    const id = url.split("/").filter(Boolean).pop();
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }

  private static getGameGeneration(version: string): string {
    const gameGenerations: { [key: string]: string } = {
      red: "Gen 1",
      blue: "Gen 1",
      yellow: "Gen 1",
      gold: "Gen 2",
      silver: "Gen 2",
      crystal: "Gen 2",
      ruby: "Gen 3",
      sapphire: "Gen 3",
      emerald: "Gen 3",
      firered: "Gen 3",
      leafgreen: "Gen 3",
      diamond: "Gen 4",
      pearl: "Gen 4",
      platinum: "Gen 4",
      heartgold: "Gen 4",
      soulsilver: "Gen 4",
      black: "Gen 5",
      white: "Gen 5",
      "black-2": "Gen 5",
      "white-2": "Gen 5",
      x: "Gen 6",
      y: "Gen 6",
      "omega-ruby": "Gen 6",
      "alpha-sapphire": "Gen 6",
      sun: "Gen 7",
      moon: "Gen 7",
      "ultra-sun": "Gen 7",
      "ultra-moon": "Gen 7",
      sword: "Gen 8",
      shield: "Gen 8",
      "brilliant-diamond": "Gen 8",
      "shining-pearl": "Gen 8",
      "legends-arceus": "Gen 8",
      scarlet: "Gen 9",
      violet: "Gen 9",
    };

    return gameGenerations[version.toLowerCase()] || "Unknown";
  }
}
