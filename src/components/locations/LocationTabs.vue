<!-- src/components/locations/LocationTabs.vue -->
<template>
  <div class="mb-6">
    <div class="flex border-b overflow-x-auto">
      <button
        v-for="region in regions"
        :key="region"
        @click="$emit('change-region', region)"
        :class="[
          'px-4 py-2 font-medium whitespace-nowrap',
          selectedRegion === region
            ? 'border-b-2 border-pokemon-cerulean text-pokemon-cerulean'
            : 'text-gray-500 hover:text-gray-700',
        ]"
      >
        {{ region }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  selectedRegion: string;
  regions: string[];
}>();

defineEmits<{
  (e: "change-region", region: string): void;
}>();
</script>
