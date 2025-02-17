<template>
  <div class="w-full mx-auto font-space">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8 sm:py-12">
      <div class="pokeball mx-auto"></div>
    </div>

    <!-- Moves Filters -->
    <div v-else class="bg-white p-3 sm:p-4 rounded-lg shadow-md mb-4 sm:mb-6">
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
      >
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
            placeholder="Search Move..."
            class="w-full pl-10 pr-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-cerulean focus:border-pokemon-cerulean transition-colors"
          />
        </div>

        <!-- Type Filter -->
        <div class="relative">
          <select
            v-model="selectedType"
            class="w-full px-3 pr-8 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-cerulean focus:border-pokemon-cerulean appearance-none transition-colors"
          >
            <option value="">All Types</option>
            <option
              v-for="category in moveCategories"
              :key="category"
              :value="category.toLowerCase()"
            >
              {{ category }}
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

        <!-- Category Filter -->
        <div class="relative">
          <select
            v-model="selectedCategory"
            class="w-full px-3 pr-8 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-cerulean focus:border-pokemon-cerulean appearance-none transition-colors"
          >
            <option value="">All Categories</option>
            <option
              v-for="type in moveTypes"
              :key="type"
              :value="type.toLowerCase()"
            >
              {{ type }}
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

    <!-- Moves Table -->
    <div class="overflow-x-auto">
      <table
        class="w-full bg-gray-800 text-white rounded-lg border border-pokemon-cerulean"
      >
        <thead>
          <tr>
            <th class="px-4 py-2 text-left border-b border-pokemon-cerulean">
              Name
            </th>
            <th class="px-4 py-2 text-left border-b border-pokemon-cerulean">
              Type
            </th>
            <th class="px-4 py-2 text-left border-b border-pokemon-cerulean">
              Category
            </th>
            <th class="px-4 py-2 text-left border-b border-pokemon-cerulean">
              Power
            </th>
            <th class="px-4 py-2 text-left border-b border-pokemon-cerulean">
              PP
            </th>
            <th class="px-4 py-2 text-left border-b border-pokemon-cerulean">
              Accuracy
            </th>
            <th class="px-4 py-2 text-left border-b border-pokemon-cerulean">
              Effect
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="move in filteredMoves"
            :key="move.name"
            class="border-t border-gray-700"
          >
            <td class="px-4 py-2">{{ move.name }}</td>
            <td class="px-4 py-2">
              <span
                :class="{
                  'bg-red-600 px-2 py-1 rounded text-white':
                    move.category === 'physical',
                  'bg-blue-600 px-2 py-1 rounded text-white':
                    move.category === 'special',
                  'bg-gray-600 px-2 py-1 rounded text-white':
                    move.category === 'status',
                }"
                >{{ move.type }}</span
              >
            </td>
            <td class="px-4 py-2">{{ move.category }}</td>
            <td class="px-4 py-2">{{ move.power }}</td>
            <td class="px-4 py-2">{{ move.pp }}</td>
            <td class="px-4 py-2">{{ move.accuracy }}</td>
            <td class="px-4 py-2">{{ move.effect }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { MovesService } from "../services/MovesService";
import type { Move } from "../types/moves";

const moves = ref<Move[]>([]);
const searchQuery = ref("");
const selectedType = ref("");
const selectedCategory = ref("");
const loading = ref(true);

// Categories are move damage classes
const moveTypes = ["Physical", "Special", "Status"];

// Types are the Pokémon types
const moveCategories = [
  "Normal",
  "Fighting",
  "Flying",
  "Poison",
  "Ground",
  "Rock",
  "Bug",
  "Ghost",
  "Steel",
  "Fire",
  "Water",
  "Grass",
  "Electric",
  "Psychic",
  "Ice",
  "Dragon",
  "Dark",
  "Fairy",
];

const filteredMoves = computed(() => {
  return moves.value.filter((move) => {
    // Case-insensitive name search
    const nameMatch =
      searchQuery.value === "" ||
      move.name.toLowerCase().includes(searchQuery.value.toLowerCase());

    // Type filter (move.type is the Pokémon type)
    const typeMatch =
      selectedType.value === "" ||
      move.type.toLowerCase() === selectedType.value.toLowerCase();

    // Category filter (move.category is physical/special/status)
    const categoryMatch =
      selectedCategory.value === "" ||
      move.category.toLowerCase() === selectedCategory.value.toLowerCase();

    return nameMatch && typeMatch && categoryMatch;
  });
});

onMounted(async () => {
  try {
    moves.value = await MovesService.getAllMoves();
    console.log("Loaded moves:", moves.value); // Debug log
  } catch (error) {
    console.error("Failed to load moves:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<style>
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

select {
  background-color: white;
}

table {
  border-collapse: separate;
  border-spacing: 0;
}

th:first-child,
td:first-child {
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
}

th:last-child,
td:last-child {
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}
</style>
