<!-- src/views/MovesView.vue -->
<template>
  <div class="moves-view p-6">
    <h1 class="text-3xl font-bold mb-6">Moves</h1>
    <MovesTable />
  </div>
</template>

<script setup lang="ts">
import MovesTable from "../components/MovesTable.vue";
</script>
