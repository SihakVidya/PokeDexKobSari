<!-- src/components/PokemonFilters.vue -->
<template>
  <div class="bg-white p-3 sm:p-4 rounded-lg shadow-md mb-4 sm:mb-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      <!-- Search Input -->
      <div class="relative">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <svg
            class="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search Pokémon..."
          class="w-full pl-10 pr-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-cerulean focus:border-pokemon-cerulean transition-colors"
          @input="emitFilters"
        />
      </div>

      <!-- Generation Filter -->
      <div class="relative">
        <select
          v-model="selectedGeneration"
          class="w-full px-3 pr-8 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-cerulean focus:border-pokemon-cerulean appearance-none transition-colors"
          @change="emitFilters"
        >
          <option value="">All Generations</option>
          <option
            v-for="gen in generations"
            :key="gen.value"
            :value="gen.value"
          >
            {{ gen.label }}
          </option>
        </select>
        <div
          class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
        >
          <svg
            class="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M19 9l-7 7-7-7"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </div>
      </div>

      <!-- Type Filter -->
      <div class="relative">
        <select
          v-model="selectedType"
          class="w-full px-3 pr-8 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-cerulean focus:border-pokemon-cerulean appearance-none transition-colors"
          @change="emitFilters"
        >
          <option value="">All Types</option>
          <option v-for="type in types" :key="type" :value="type">
            {{ type.charAt(0).toUpperCase() + type.slice(1) }}
          </option>
        </select>
        <div
          class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
        >
          <svg
            class="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M19 9l-7 7-7-7"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { PokemonTypeService } from "../services/PokemonTypeService";

const searchQuery = ref("");
const selectedGeneration = ref("");
const selectedType = ref("");

const generations = [
  { value: "1", label: "Gen I (1-151)" },
  { value: "2", label: "Gen II (152-251)" },
  { value: "3", label: "Gen III (252-386)" },
  { value: "4", label: "Gen IV (387-493)" },
  { value: "5", label: "Gen V (494-649)" },
  { value: "6", label: "Gen VI (650-721)" },
  { value: "7", label: "Gen VII (722-809)" },
  { value: "8", label: "Gen VIII (810-905)" },
  { value: "9", label: "Gen IX (906-1010)" },
];

const types = ref<string[]>([]);

onMounted(async () => {
  try {
    const response = await PokemonTypeService.getAllTypes();
    types.value = response.results.map((type) => type.name);
  } catch (error) {
    console.error("Failed to load types:", error);
  }
});

const emitFilters = () => {
  emit("filter", {
    search: searchQuery.value,
    generation: selectedGeneration.value,
    type: selectedType.value,
  });
};

const emit = defineEmits<{
  (
    e: "filter",
    filters: {
      search: string;
      generation: string;
      type: string;
    }
  ): void;
}>();
</script>

<style scoped>
/* Custom select styling */
select {
  background-color: white;
}

/* Focus styles */
input:focus,
select:focus {
  outline: none;
}

/* Transition for hover and focus states */
input,
select {
  transition: all 0.2s ease-in-out;
}
</style>
