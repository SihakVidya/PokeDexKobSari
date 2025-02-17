<!-- src/views/TypesView.vue -->
<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-3xl font-bold mb-6">Pokémon Types</h1>
    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 font-space"
    >
      <router-link
        v-for="type in types"
        :key="type.name"
        :to="`/types/${type.name}`"
        :class="[
          TypeService.getTypeColor(type.name),
          'p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform',
          'flex flex-col items-center justify-center space-y-2 cursor-pointer',
        ]"
      >
        <img
          :src="`/src/assets/images/poketypes/${type.name}.svg`"
          :alt="type.name"
          class="w-8 h-8"
        />
        <span class="text-white font-medium capitalize">{{ type.name }}</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { TypeService } from "../services/TypeService";
import type { Type } from "../types/types";

const types = ref<Type[]>([]);

onMounted(async () => {
  try {
    const allTypes = await TypeService.getAllTypes();
    types.value = allTypes.filter(
      (type) => type.name !== "stellar" && type.name !== "unknown"
    );
  } catch (error) {
    console.error("Failed to load types:", error);
  }
});
</script>
