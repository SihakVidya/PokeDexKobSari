<template>
  <div class="font-space">
    <div v-if="loading" class="text-center py-8">
      <div class="pokeball mx-auto"></div>
    </div>
    <div v-else class="max-w-4xl mx-auto p-4">
      <!-- Ability Header -->
      <h1 class="text-3xl font-bold mb-6">{{ ability?.name }}</h1>

      <!-- Main Effect -->
      <div class="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 class="text-xl font-semibold mb-2">Effect</h2>
        <p class="text-gray-700" v-if="ability">{{ ability.effect }}</p>
      </div>

      <!-- Game Descriptions -->
      <div class="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 class="text-xl font-semibold mb-4">Game Descriptions</h2>
        <div class="space-y-4">
          <div
            v-for="(text, index) in ability?.flavorTexts"
            :key="index"
            class="p-3 bg-gray-50 rounded"
          >
            <h3 class="font-medium text-gray-900 mb-1">
              {{ formatVersionGroup(text.versionGroup) }}
            </h3>
            <p class="text-gray-700">{{ text.flavorText }}</p>
          </div>
        </div>
      </div>

      <!-- Pokémon with this Ability -->
      <div class="bg-white rounded-lg shadow-md p-4">
        <h2 class="text-xl font-semibold mb-4">
          Pokémon with {{ ability?.name }}
        </h2>
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="pokemon in ability?.pokemon"
            :key="pokemon.pokemon.name"
            class="flex items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
            @click="navigateToPokemon(pokemon.pokemon.url)"
          >
            <img
              :src="getPokemonSprite(pokemon.pokemon.url)"
              :alt="pokemon.pokemon.name"
              class="w-16 h-16 object-contain"
            />
            <div class="ml-3">
              <p class="font-medium">
                {{ formatPokemonName(pokemon.pokemon.name) }}
              </p>
              <p class="text-sm text-gray-500">
                {{ pokemon.isHidden ? "Hidden Ability" : "Regular Ability" }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { AbilityService } from "../services/AbilityService";
import type { Ability } from "../types/abilities";

const route = useRoute();
const router = useRouter();
const ability = ref<Ability | null>(null);
const loading = ref(true);

const formatVersionGroup = (version: string) => {
  return version
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatPokemonName = (name: string) => {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getPokemonSprite = (url: string) => {
  const id = url.split("/").filter(Boolean).pop();
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
};

const navigateToPokemon = async (url: string) => {
  const id = url.split("/").filter(Boolean).pop();
  if (parseInt(route.params.id as string) === parseInt(id as string)) {
    return; // Don't navigate if we're already on this Pokemon
  }
  await router.push(`/pokemon/${id}`);
};

onMounted(async () => {
  try {
    const abilityName = route.params.name as string;
    // The URL parameter is already kebab-case, so we can use it directly
    const data = await AbilityService.getAbilityDetail(abilityName);
    ability.value = data;
  } catch (error) {
    console.error("Failed to load ability details:", error);
    // Optionally redirect to 404 page or show error message
  } finally {
    loading.value = false;
  }
});
</script>
