<!-- src/views/PokemonView.vue -->
<!-- src/views/PokemonView.vue -->
<template>
  <div class="font-space max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
    <!-- Search and Filters -->
    <PokemonFilters @filter="applyFilters" />

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8 sm:py-12">
      <div
        class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-pokemon-cerulean border-t-transparent mx-auto"
      ></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8 sm:py-12 text-pokemon-red">
      {{ error }}
    </div>

    <!-- Pokemon Grid -->
    <div v-else>
      <!-- Pokemon Count -->
      <div class="text-center mb-4 text-sm sm:text-base text-gray-600">
        Showing {{ filteredPokemon.length }} Pokémon
      </div>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
      >
        <PokemonCard
          v-for="pokemon in displayedPokemon"
          :key="pokemon.id"
          :pokemon="pokemon"
        />
      </div>

      <!-- Pagination -->
      <div
        class="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4"
      >
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="w-full sm:w-auto px-4 py-2 bg-pokemon-cerulean text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition-colors text-sm sm:text-base"
        >
          Previous
        </button>
        <span class="px-2 py-1 text-sm sm:text-base text-center">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="w-full sm:w-auto px-4 py-2 bg-pokemon-cerulean text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition-colors text-sm sm:text-base"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { PokemonService } from "../services/PokemonService";
import PokemonCard from "../components/PokemonCard.vue";
import PokemonFilters from "../components/PokemonFilters.vue";
import type { PokemonDetail } from "../types/pokemon";

const ITEMS_PER_PAGE = 50;

const allPokemon = ref<PokemonDetail[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const currentPage = ref(1);

// Filter states
const filters = ref({
  search: "",
  generation: "",
  type: "",
});

// Apply filters from the filter component
const applyFilters = (newFilters: typeof filters.value) => {
  filters.value = newFilters;
  currentPage.value = 1; // Reset to first page when filters change
};

// Filter Pokemon based on current filters
const filteredPokemon = computed(() => {
  return allPokemon.value.filter((pokemon) => {
    // Search filter
    if (
      filters.value.search &&
      !pokemon.name.toLowerCase().includes(filters.value.search.toLowerCase())
    ) {
      return false;
    }

    // Generation filter
    if (filters.value.generation) {
      const genRanges: Record<string, [number, number]> = {
        "1": [1, 151],
        "2": [152, 251],
        "3": [252, 386],
        "4": [387, 493],
        "5": [494, 649],
        "6": [650, 721],
        "7": [722, 809],
        "8": [810, 905],
        "9": [906, 1010],
      };
      const [min, max] = genRanges[filters.value.generation];
      if (pokemon.id < min || pokemon.id > max) {
        return false;
      }
    }

    // Type filter
    if (
      filters.value.type &&
      !pokemon.types.some((t) => t.type.name === filters.value.type)
    ) {
      return false;
    }

    return true;
  });
});

// Paginate filtered results
const totalPages = computed(() =>
  Math.ceil(filteredPokemon.value.length / ITEMS_PER_PAGE)
);

const displayedPokemon = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  return filteredPokemon.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Load all Pokemon on mount
onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;
    allPokemon.value = await PokemonService.getAllPokemon();
  } catch (e) {
    error.value = "Failed to load Pokemon. Please try again.";
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>
