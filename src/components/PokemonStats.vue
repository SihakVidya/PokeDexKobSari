// src/components/PokemonStats.vue
<template>
  <div class="space-y-4">
    <div v-for="stat in processedStats" :key="stat.label" class="w-full">
      <div class="flex justify-between items-center mb-1">
        <span class="text-sm font-medium capitalize">{{ stat.label }}</span>
        <span class="text-sm font-medium">{{ stat.value }}/255</span>
      </div>
      <div class="h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-500"
          :class="stat.color"
          :style="{ width: `${(stat.value / 255) * 100}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Stat {
  base_stat: number;
  stat: {
    name: string;
  };
}

const props = defineProps<{
  stats: Stat[];
}>();

interface ProcessedStat {
  label: string;
  value: number;
  color: string;
}

const processedStats = computed<ProcessedStat[]>(() => {
  return props.stats.map((stat) => {
    let label: string;
    let color: string;

    // Map stat names to more readable labels
    switch (stat.stat.name) {
      case "hp":
        label = "HP";
        color = "bg-red-500";
        break;
      case "attack":
        label = "Attack";
        color = "bg-orange-500";
        break;
      case "defense":
        label = "Defense";
        color = "bg-yellow-500";
        break;
      case "special-attack":
        label = "Sp. Attack";
        color = "bg-blue-500";
        break;
      case "special-defense":
        label = "Sp. Defense";
        color = "bg-green-500";
        break;
      case "speed":
        label = "Speed";
        color = "bg-purple-500";
        break;
      default:
        label = stat.stat.name;
        color = "bg-gray-500";
    }

    return {
      label,
      value: stat.base_stat,
      color,
    };
  });
});
</script>
