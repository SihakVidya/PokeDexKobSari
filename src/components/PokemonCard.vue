<template>
  <div
    class="card-bg rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-transform duration-300 transform hover:scale-105"
  >
    <div class="relative p-4">
      <img
        :src="pokemon.sprites.other['official-artwork'].front_default"
        :alt="pokemon.name"
        class="pokemon-image w-full h-48 object-contain relative z-10"
      />
      <div class="absolute top-4 right-4 text-white font-space z-10">
        #{{ String(pokemon.id).padStart(3, "0") }}
      </div>
    </div>

    <div class="p-4 bg-pokemon-cerulean text-pokemon-yellow">
      <h2 class="text-xl font-space font-bold capitalize mb-2">
        {{ pokemon.name }}
      </h2>

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
          <span class="text-white text-sm font-space capitalize">
            {{ type.type.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { PokemonDetail } from "../types/pokemon";
import { PokemonTypeService } from "../services/PokemonTypeService";

const props = defineProps<{
  pokemon: PokemonDetail;
}>();

const typeSprites = ref<Record<string, string>>({});

onMounted(async () => {
  // Fetch type sprites for each pokemon type
  for (const type of props.pokemon.types) {
    try {
      const typeData = await PokemonTypeService.getTypeDetails(type.type.name);
      const bdspSprite = PokemonTypeService.getBDSPSprite(typeData);
      if (bdspSprite) {
        typeSprites.value[type.type.name] = bdspSprite;
      }
    } catch (error) {
      console.error(`Failed to load sprite for type ${type.type.name}:`, error);
    }
  }
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
</script>

<style>
/* src/assets/styles/pokemon-card.css */
.card-bg {
  background-image: url(../assets/images/bg.jpg);
  position: relative;
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.card-bg::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(
    0,
    0,
    0,
    0.4
  ); /* Adjust the last value (0.4) for darkness level */
  z-index: 1;
}

/* Ensure the content is above the overlay */
.card-bg > * {
  position: relative;
  z-index: 2;
}

.pokemon-image {
  transition: transform 0.3s ease-in-out;
}

.pokemon-image:hover {
  transform: scale(1.1);
}
</style>
