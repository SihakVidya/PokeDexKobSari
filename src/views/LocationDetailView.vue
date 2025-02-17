<!-- src/views/LocationDetailView.vue -->
<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8 sm:py-12">
      <div class="pokeball mx-auto"></div>
    </div>

    <div v-else-if="location" class="space-y-6">
      <!-- Location Header -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold">{{ location.name }}</h1>
            <p class="text-gray-600 mt-1">{{ location.region }} Region</p>
          </div>
          <div class="text-right">
            <span class="text-sm text-gray-600">Generation</span>
            <p class="text-lg font-medium">{{ location.generation }}</p>
          </div>
        </div>
      </div>

      <!-- Encounter Methods -->
      <div class="space-y-6">
        <EncounterGroup
          v-for="method in location.encounters"
          :key="method.method"
          :title="method.method"
          :description="method.description"
          :encounters="method.pokemon"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { LocationService } from "../services/LocationService";
import EncounterGroup from "../components/locations/EncounterGroup.vue";
import type { Location } from "../types/locations";

const route = useRoute();
const loading = ref(true);
const location = ref<Location | null>(null);

onMounted(async () => {
  try {
    const locationId = route.params.id as string;
    location.value = await LocationService.getLocationDetail(
      Number(locationId)
    );
  } catch (error) {
    console.error("Failed to load location details:", error);
  } finally {
    loading.value = false;
  }
});
</script>
