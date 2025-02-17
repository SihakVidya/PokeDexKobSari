<!-- src/views/LocationsView.vue -->
<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-6">Pokémon Locations</h1>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8 sm:py-12">
      <div class="pokeball mx-auto"></div>
    </div>

    <div v-else>
      <!-- Region Tabs -->
      <LocationTabs
        :selected-region="selectedRegion"
        :regions="regions"
        @change-region="handleRegionChange"
      />

      <!-- Search Bar -->
      <div class="bg-white p-4 rounded-lg shadow-md mb-6">
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
            placeholder="Search locations..."
            class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-cerulean focus:border-pokemon-cerulean"
          />
        </div>
      </div>

      <!-- Locations Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <router-link
          v-for="location in filteredLocations"
          :key="location.id"
          :to="`/locations/${location.id}`"
          class="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow"
        >
          <h3 class="text-lg font-medium">{{ location.name }}</h3>
          <p class="text-gray-600 text-sm mt-1">
            Generation {{ location.generation }}
          </p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { LocationService } from "../services/LocationService";
import LocationTabs from "../components/locations/LocationTabs.vue";
import type { Location } from "../types/locations";

const loading = ref(true);
const locations = ref<Location[]>([]);
const selectedRegion = ref("Kanto");
const searchQuery = ref("");

const regions = [
  "Kanto",
  "Johto",
  "Hoenn",
  "Sinnoh",
  "Unova",
  "Kalos",
  "Alola",
  "Galar",
  "Hisui",
  "Paldea",
];

const filteredLocations = computed(() => {
  return locations.value.filter((location) =>
    location.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const handleRegionChange = async (region: string) => {
  selectedRegion.value = region;
  await loadLocations(region);
};

const loadLocations = async (region: string) => {
  loading.value = true;
  try {
    locations.value = await LocationService.getLocationsByRegion(region);
  } catch (error) {
    console.error("Failed to load locations:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => loadLocations(selectedRegion.value));
</script>
