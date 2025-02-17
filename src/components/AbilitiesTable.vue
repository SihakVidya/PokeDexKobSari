<template>
  <div class="w-full mx-auto font-space">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8 sm:py-12">
      <div class="pokeball mx-auto"></div>
    </div>

    <!-- Abilities Filters -->
    <div v-else class="bg-white p-3 sm:p-4 rounded-lg shadow-md mb-4 sm:mb-6">
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
          placeholder="Search Ability..."
          class="w-full pl-10 pr-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-cerulean focus:border-pokemon-cerulean transition-colors"
          @input="handleSearch"
        />
      </div>
    </div>

    <!-- Abilities Table -->
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
              Effect
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="ability in paginatedAbilities"
            :key="ability.name"
            class="border-t border-gray-700 hover:bg-gray-700 cursor-pointer"
            @click="navigateToDetail(ability.name)"
          >
            <td class="px-4 py-2">{{ ability.name }}</td>
            <td class="px-4 py-2">{{ ability.shortEffect }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex justify-center">
      <nav class="flex space-x-2">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          v-for="pageNum in visiblePages"
          :key="pageNum"
          @click="changePage(pageNum)"
          :class="[
            'px-3 py-1 rounded',
            currentPage === pageNum
              ? 'bg-pokemon-cerulean text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          {{ pageNum }}
        </button>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { AbilityService } from "../services/AbilityService";
import type { Ability } from "../types/abilities";
import { debounce } from "lodash";

const router = useRouter();
const allAbilities = ref<Ability[]>([]); // Store all abilities
const loading = ref(true);
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 20;

// Computed total pages based on filtered abilities
const totalPages = computed(() =>
  Math.ceil(filteredAbilities.value.length / itemsPerPage)
);

// Filter abilities based on search
const filteredAbilities = computed(() => {
  if (!searchQuery.value) return allAbilities.value;
  const query = searchQuery.value.toLowerCase();
  return allAbilities.value.filter(
    (ability) =>
      ability.name.toLowerCase().includes(query) ||
      ability.shortEffect.toLowerCase().includes(query)
  );
});

// Get current page abilities
const paginatedAbilities = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredAbilities.value.slice(start, end);
});

// Debounced search handler
const debouncedSearch = debounce(async () => {
  currentPage.value = 1;
}, 300);

const handleSearch = async () => {
  debouncedSearch();
};

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Compute visible pages for pagination
const visiblePages = computed(() => {
  const maxVisiblePages = window.innerWidth < 640 ? 5 : 10;
  const half = Math.floor(maxVisiblePages / 2);
  let start = Math.max(currentPage.value - half, 1);
  let end = Math.min(start + maxVisiblePages - 1, totalPages.value);

  if (end - start < maxVisiblePages - 1) {
    start = Math.max(end - maxVisiblePages + 1, 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const loadAllAbilities = async () => {
  loading.value = true;
  try {
    // Load all abilities at once
    const result = await AbilityService.getAllAbilities(1, 9999);
    allAbilities.value = result.abilities;
  } catch (error) {
    console.error("Failed to load abilities:", error);
  } finally {
    loading.value = false;
  }
};

const navigateToDetail = (abilityName: string) => {
  // Convert the ability name to kebab case for the URL
  const urlName = abilityName.toLowerCase().replace(/\s+/g, "-");
  router.push(`/abilities/${urlName}`);
};

onMounted(loadAllAbilities);
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
