<template>
  <div class="min-h-screen bg-linear-to-r from-cyan-200 to-blue-200">
    <Header />
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Header from "./components/Header.vue";
</script>
