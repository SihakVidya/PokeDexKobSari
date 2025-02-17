// src/views/PokemonDetailView.vue
<template>
  <div class="font-space max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8 sm:py-12">
      <div class="pokeball"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8 sm:py-12 text-pokemon-red">
      {{ error }}
    </div>

    <!-- Pokemon Details -->
    <div v-else-if="pokemon" class="max-w-4xl mx-auto">
      <!-- Header with Name and ID -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold capitalize">{{ pokemon.name }}</h1>
        <span class="text-xl text-gray-600">
          #{{ String(pokemon.id).padStart(3, "0") }}
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Left Column: Image and Types -->
        <div class="space-y-6">
          <!-- Pokemon Image -->
          <div class="bg-white rounded-lg p-6 shadow-lg">
            <img
              v-if="pokemon.sprites.other['official-artwork'].front_default"
              :src="pokemon.sprites.other['official-artwork'].front_default"
              :alt="pokemon.name"
              class="w-full h-auto object-contain"
            />
          </div>

          <!-- Types -->
          <div class="flex gap-2">
            <div
              v-for="type in pokemon.types"
              :key="type.type.name"
              class="flex items-center gap-1 px-3 py-1 rounded-full"
              :class="getTypeColor(type.type.name)"
            >
              <img
                v-if="typeSprites[type.type.name]"
                :src="typeSprites[type.type.name]"
                :alt="type.type.name"
                class="w-5 h-5 object-contain"
              />
              <span class="text-white font-space capitalize">
                {{ type.type.name }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <div class="bg-white rounded-lg p-6 shadow-lg">
            <h2 class="text-xl font-semibold mb-4">Description</h2>
            <p class="text-gray-700">{{ description }}</p>
          </div>
        </div>

        <!-- Right Column: Info and Stats -->
        <div class="space-y-6">
          <!-- Pokemon Info -->
          <div class="bg-white rounded-lg p-6 shadow-lg">
            <h2 class="text-xl font-semibold mb-4">Info</h2>
            <table class="w-full">
              <tbody>
                <tr
                  v-for="info in pokemonInfo"
                  :key="info.label"
                  class="border-b"
                >
                  <td class="py-2 font-medium">{{ info.label }}</td>
                  <td class="py-2">{{ info.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Base Stats -->
          <div class="bg-white rounded-lg p-6 shadow-lg">
            <h2 class="text-xl font-semibold mb-4">Base Stats</h2>
            <PokemonStats :stats="pokemon.stats" />

            <!-- Total Stats -->
            <div class="mt-4 pt-4 border-t">
              <div class="flex justify-between items-center">
                <span class="font-medium">Total</span>
                <span class="font-medium">{{ totalStats }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Evolution Chain -->
      <div class="mt-8 bg-white rounded-lg p-6 shadow-lg">
        <h2 class="text-xl font-semibold mb-6">Evolution Chain</h2>
        <div class="flex items-center justify-center gap-4 flex-wrap">
          <template
            v-for="(evolution, index) in evolutionChain"
            :key="evolution.id"
          >
            <!-- Pokemon Evolution -->
            <div
              @click="navigateToPokemon(evolution.id)"
              class="flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
            >
              <img
                :src="evolution.sprite"
                :alt="evolution.name"
                class="w-24 h-24 object-contain"
              />
              <span class="mt-2 text-sm font-medium capitalize">
                {{ evolution.name }}
              </span>
            </div>

            <!-- Evolution Arrow -->
            <div
              v-if="index < evolutionChain.length - 1"
              class="flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { PokemonService } from "../services/PokemonService";
import { PokemonTypeService } from "../services/PokemonTypeService";
import PokemonStats from "../components/PokemonStats.vue";
import type {
  PokemonDetail,
  PokemonSpecies,
  ProcessedEvolution,
  EvolutionChain,
  ChainLink,
} from "../types/pokemon";

const route = useRoute();
const router = useRouter();
const pokemon = ref<PokemonDetail | null>(null);
const description = ref("");
const evolutionChain = ref<ProcessedEvolution[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const typeSprites = ref<Record<string, string>>({});
const pokemonInfo = ref<Array<{ label: string; value: string }>>([]);

const totalStats = computed(() => {
  if (!pokemon.value) return 0;
  return pokemon.value.stats.reduce((total, stat) => total + stat.base_stat, 0);
});

const getTypeColor = (type: string): string => {
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
};

const processEvolutionChain = async (
  chain: ChainLink
): Promise<ProcessedEvolution[]> => {
  const processedChain: ProcessedEvolution[] = [];
  let currentEvolution: ChainLink | null = chain;

  while (currentEvolution) {
    const pokemonId = parseInt(
      currentEvolution.species.url.split("/").slice(-2, -1)[0]
    );
    const pokemonData = await PokemonService.getPokemonDetail(pokemonId);

    processedChain.push({
      id: pokemonId,
      name: currentEvolution.species.name,
      sprite: pokemonData.sprites.other["official-artwork"].front_default,
    });

    currentEvolution = currentEvolution.evolves_to[0] || null;
  }

  return processedChain;
};

const loadPokemonData = async (id: number) => {
  try {
    loading.value = true;
    error.value = null;

    // Fetch Pokemon details
    const pokemonData = await PokemonService.getPokemonDetail(id);
    pokemon.value = pokemonData;

    // Fetch type sprites
    typeSprites.value = {}; // Reset type sprites
    for (const type of pokemonData.types) {
      try {
        const typeData = await PokemonTypeService.getTypeDetails(
          type.type.name
        );
        const bdspSprite = PokemonTypeService.getBDSPSprite(typeData);
        if (bdspSprite) {
          typeSprites.value[type.type.name] = bdspSprite;
        }
      } catch (error) {
        console.error(
          `Failed to load sprite for type ${type.type.name}:`,
          error
        );
      }
    }

    // Fetch species data for description
    const speciesData: PokemonSpecies = await PokemonService.getPokemonSpecies(
      id
    );
    const englishFlavorText = speciesData.flavor_text_entries.find(
      (entry) => entry.language.name === "en"
    );
    description.value =
      englishFlavorText?.flavor_text.replace(/\f/g, " ") ||
      "No description available.";

    // Set pokemon info
    pokemonInfo.value = [
      {
        label: "Pokédex Number",
        value: `#${String(pokemonData.id).padStart(3, "0")}`,
      },
      { label: "Height", value: `${pokemonData.height / 10} m` },
      { label: "Weight", value: `${pokemonData.weight / 10} kg` },
      {
        label: "Abilities",
        value: pokemonData.abilities.map((a) => a.ability.name).join(", "),
      },
      { label: "Shape", value: speciesData.shape?.name || "Unknown" },
      { label: "Color", value: speciesData.color?.name || "Unknown" },
    ];

    // Fetch and process evolution chain
    const evolutionData: EvolutionChain =
      await PokemonService.getEvolutionChain(speciesData.evolution_chain.url);
    const processedChain = await processEvolutionChain(evolutionData.chain);
    evolutionChain.value = processedChain;
  } catch (e) {
    error.value = "Failed to load Pokemon details. Please try again.";
    console.error(e);
  } finally {
    loading.value = false;
  }
};

// Watch for route changes
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadPokemonData(parseInt(newId as string));
    }
  }
);

// Update navigateToPokemon to handle same-page navigation
const navigateToPokemon = async (id: number) => {
  if (parseInt(route.params.id as string) === id) {
    return; // Don't navigate if we're already on this Pokemon
  }
  await router.push(`/pokemon/${id}`);
};

onMounted(() => {
  const id = parseInt(route.params.id as string);
  loadPokemonData(id);
});
</script>
