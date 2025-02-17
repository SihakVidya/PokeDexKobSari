<!-- src/components/locations/RarityBadge.vue -->
<template>
  <div
    class="relative"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
  >
    <div
      class="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium text-sm"
      :class="backgroundColor"
    >
      {{ value }}%
    </div>
    <div
      v-if="showTooltip"
      class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap"
    >
      {{ rarityText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{
  value: number;
}>();

const showTooltip = ref(false);

const backgroundColor = computed(() => {
  if (props.value >= 50) return "bg-green-500";
  if (props.value >= 25) return "bg-yellow-500";
  return "bg-red-500";
});

const rarityText = computed(() => {
  if (props.value >= 50) return "Common";
  if (props.value >= 25) return "Uncommon";
  return "Rare";
});
</script>
