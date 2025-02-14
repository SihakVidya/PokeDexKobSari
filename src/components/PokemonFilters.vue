<!-- src/components/PokemonFilters.vue -->
<template>
  <div class="bg-white p-4 rounded-lg shadow-md mb-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Search Input -->
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search Pokémon..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pokemon-cerulean focus:border-pokemon-cerulean"
          @input="emitFilters"
        />
      </div>

      <!-- Generation Filter -->
      <div class="relative">
        <select
          v-model="selectedGeneration"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pokemon-cerulean focus:border-pokemon-cerulean"
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
      </div>

      <!-- Type Filter -->
      <div class="relative">
        <select
          v-model="selectedType"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pokemon-cerulean focus:border-pokemon-cerulean"
          @change="emitFilters"
        >
          <option value="">All Types</option>
          <option v-for="type in types" :key="type" :value="type">
            {{ type.charAt(0).toUpperCase() + type.slice(1) }}
          </option>
        </select>
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
  { value: "1", label: "Generation I (1-151)" },
  { value: "2", label: "Generation II (152-251)" },
  { value: "3", label: "Generation III (252-386)" },
  { value: "4", label: "Generation IV (387-493)" },
  { value: "5", label: "Generation V (494-649)" },
  { value: "6", label: "Generation VI (650-721)" },
  { value: "7", label: "Generation VII (722-809)" },
  { value: "8", label: "Generation VIII (810-905)" },
  { value: "9", label: "Generation IX (906-1010)" },
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
