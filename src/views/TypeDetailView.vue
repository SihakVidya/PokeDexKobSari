<!-- src/views/TypeDetailView.vue -->
<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8 sm:py-12">
      <div class="pokeball mx-auto"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8 text-pokemon-red">
      {{ error }}
    </div>

    <!-- Content -->
    <div v-else-if="type" class="space-y-6">
      <!-- Type Header -->
      <div class="flex items-center gap-4">
        <div :class="[TypeService.getTypeColor(type.name), 'p-3 rounded-lg']">
          <img
            :src="`/src/assets/images/poketypes/${type.name}.svg`"
            :alt="type.name"
            class="w-8 h-8"
          />
        </div>
        <h1
          class="text-black font-pokemon text-xl sm:text-2xl md:text-3xl tracking-widest drop-shadow-lg flex items-center gap-2 capitalize"
        >
          {{ type.name }}
        </h1>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 font-space">
        <!-- Type Relations (1/3 of screen) -->
        <div class="bg-white rounded-lg shadow-lg p-6 lg:col-span-1">
          <h2 class="text-xl font-semibold mb-4">Type Effectiveness</h2>
          <div class="space-y-4">
            <template v-if="type.damage_relations">
              <div
                v-for="(relations, key) in damageRelations"
                :key="key"
                class="mb-4"
              >
                <h3 class="font-medium mb-2 capitalize">{{ key }}</h3>
                <div class="flex flex-wrap gap-2">
                  <router-link
                    v-for="relation in relations"
                    :key="relation.name"
                    :to="`/types/${relation.name}`"
                    :class="[
                      TypeService.getTypeColor(relation.name),
                      'p-2 rounded-lg hover:scale-110 transition-transform',
                    ]"
                  >
                    <img
                      :src="`/src/assets/images/poketypes/${relation.name}.svg`"
                      :alt="relation.name"
                      class="w-6 h-6"
                      :title="relation.name"
                    />
                  </router-link>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- Tabs for Pokémon and Moves (2/3 of screen) -->
        <div class="bg-white rounded-lg shadow-lg lg:col-span-2">
          <div class="border-b">
            <div class="flex">
              <button
                v-for="tab in tabs"
                :key="tab.value"
                @click="activeTab = tab.value"
                :class="[
                  'px-4 py-2 font-medium',
                  activeTab === tab.value
                    ? 'border-b-2 border-pokemon-cerulean text-pokemon-cerulean'
                    : 'text-gray-500 hover:text-gray-700',
                ]"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>

          <!-- Pokémon Tab -->
          <div v-if="activeTab === 'pokemon'" class="p-6">
            <div class="max-h-[600px] overflow-y-auto scrollbar-thin">
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <router-link
                  v-for="poke in typePokemon"
                  :key="poke.pokemon.name"
                  :to="`/pokemon/${getPokemonId(poke.pokemon.url)}`"
                  class="flex flex-col items-center p-4 rounded-lg hover:bg-pokemon-red hover:text-white transition-colors"
                >
                  <img
                    :src="getPokemonSprite(poke.pokemon.url)"
                    :alt="poke.pokemon.name"
                    class="w-20 h-20 object-contain"
                  />
                  <span class="mt-2 text-sm font-medium capitalize">
                    {{ poke.pokemon.name }}
                  </span>
                </router-link>
              </div>
            </div>
          </div>

          <!-- Moves Tab -->
          <div v-if="activeTab === 'moves'" class="p-6">
            <div class="max-h-[600px] overflow-y-auto scrollbar-thin">
              <table class="w-full">
                <thead class="sticky top-0 bg-white">
                  <tr>
                    <th class="text-left py-2">Name</th>
                    <th class="text-left py-2">Category</th>
                    <th class="text-left py-2">Power</th>
                    <th class="text-left py-2">PP</th>
                    <th class="text-left py-2">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="move in moves"
                    :key="move.name"
                    class="border-t hover:bg-gray-50"
                  >
                    <td class="py-2 capitalize">{{ move.name }}</td>
                    <td class="py-2 capitalize">{{ move.category }}</td>
                    <td class="py-2">{{ move.power || "-" }}</td>
                    <td class="py-2">{{ move.pp }}</td>
                    <td class="py-2">{{ move.accuracy || "-" }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { TypeService } from "../services/TypeService";
import { MovesService } from "../services/MovesService";
import type { Type } from "../types/types";
import type { Move } from "../types/moves";

const route = useRoute();
const type = ref<Type | null>(null);
const moves = ref<Move[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const activeTab = ref("pokemon");

const tabs = [
  { label: "Pokémon", value: "pokemon" },
  { label: "Moves", value: "moves" },
];

const damageRelations = computed(() => {
  if (!type.value?.damage_relations) return {};
  return {
    "Super Effective Against":
      type.value.damage_relations.double_damage_to || [],
    "Not Very Effective Against":
      type.value.damage_relations.half_damage_to || [],
    "No Effect Against": type.value.damage_relations.no_damage_to || [],
    "Weak To": type.value.damage_relations.double_damage_from || [],
    "Resistant To": type.value.damage_relations.half_damage_from || [],
    "Immune To": type.value.damage_relations.no_damage_from || [],
  };
});

const typePokemon = computed(() => type.value?.pokemon || []);

const getPokemonId = (url: string): string => {
  return url.split("/").filter(Boolean).pop() || "";
};

const getPokemonSprite = (url: string): string => {
  const id = getPokemonId(url);
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
};

const loadTypeData = async (typeName: string) => {
  loading.value = true;
  error.value = null;

  try {
    const [typeData, allMoves] = await Promise.all([
      TypeService.getTypeDetail(typeName),
      MovesService.getAllMoves(),
    ]);

    type.value = typeData;
    // Filter moves by type
    moves.value = allMoves.filter(
      (move) => move.type.toLowerCase() === typeName.toLowerCase()
    );
  } catch (err) {
    error.value = "Failed to load type details. Please try again.";
    console.error("Failed to load type details:", err);
  } finally {
    loading.value = false;
  }
};

watch(
  () => route.params.name,
  (newName) => {
    if (newName) {
      loadTypeData(newName as string);
    }
  }
);

onMounted(() => {
  const typeName = route.params.name as string;
  loadTypeData(typeName);
});
</script>

<style scoped>
.pokeball {
  width: 40px;
  height: 40px;
  background-image: url("../assets/images/pokeball.png");
  background-size: cover;
  animation: jump 1s infinite;
}

@keyframes jump {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #555;
}

@media (max-width: 1024px) {
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>
