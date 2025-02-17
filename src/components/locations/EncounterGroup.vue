<!-- src/components/locations/EncounterGroup.vue -->
<template>
  <div class="bg-white rounded-lg shadow-lg">
    <div class="border-b px-6 py-4">
      <h3 class="text-xl font-semibold">{{ title }}</h3>
      <p class="text-gray-600 text-sm mt-1">{{ description }}</p>
    </div>
    <div class="p-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="pokemon in encounters"
          :key="pokemon.pokemon.name"
          class="bg-gray-50 rounded-lg p-4 flex items-start space-x-4"
        >
          <img
            :src="pokemon.pokemon.sprite"
            :alt="pokemon.pokemon.name"
            class="w-16 h-16 object-contain"
          />
          <div class="flex-1">
            <div class="flex justify-between items-start">
              <h4 class="font-medium capitalize">{{ pokemon.pokemon.name }}</h4>
              <RarityBadge :value="pokemon.rarity" />
            </div>
            <div class="mt-2 space-y-1">
              <div class="flex items-center text-sm">
                <span class="text-gray-600 mr-2">Level:</span>
                <span>{{ pokemon.levels }}</span>
              </div>
              <div
                v-if="pokemon.seasons?.length"
                class="flex items-center text-sm"
              >
                <span class="text-gray-600 mr-2">Seasons:</span>
                <div class="flex gap-1">
                  <span
                    v-for="season in pokemon.seasons"
                    :key="season"
                    class="px-2 py-0.5 bg-gray-200 rounded text-xs"
                  >
                    {{ season }}
                  </span>
                </div>
              </div>
              <div class="flex flex-wrap gap-1 mt-2">
                <span
                  v-for="game in pokemon.games"
                  :key="game"
                  class="px-2 py-0.5 bg-gray-200 rounded text-xs"
                >
                  {{ game }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PokemonEncounter } from "../../types/locations";
import RarityBadge from "./RarityBadge.vue";

defineProps<{
  title: string;
  description: string;
  encounters: PokemonEncounter[];
}>();
</script>
