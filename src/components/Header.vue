<!-- src/components/Header.vue -->
<template>
  <header class="bg-pokemon-cerulean shadow-lg">
    <nav class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <router-link
            to="/"
            class="text-pokemon-yellow font-pokemon font-bold text-3xl tracking-widest drop-shadow-lg"
          >
            Pokédex Kob Sari
          </router-link>
          <img
            src="../assets/images/pokeball.gif"
            alt="Pokéball"
            class="w-10 h-10 inline-block"
          />
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:block">
          <div class="flex items-center space-x-4">
            <router-link
              v-for="route in routes"
              :key="route.path"
              :to="route.path"
              class="text-white font-space px-3 py-2 rounded-md text-sm font-medium hover:bg-pokemon-bu-red transition-colors"
              :class="{ 'bg-pokemon-bu-red': isCurrentRoute(route.path) }"
            >
              {{ route.name }}
            </router-link>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            @click="isOpen = !isOpen"
            class="text-white hover:text-pokemon-yellow focus:outline-none"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                v-if="!isOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="isOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link
            v-for="route in routes"
            :key="route.path"
            :to="route.path"
            class="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-pokemon-bu-red transition-colors"
            :class="{ 'bg-pokemon-bu-red': isCurrentRoute(route.path) }"
            @click="isOpen = false"
          >
            {{ route.name }}
          </router-link>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isOpen = ref(false);

const routes = [
  { path: "/pokemon", name: "Pokémon" },
  { path: "/moves", name: "Moves" },
  { path: "/abilities", name: "Abilities" },
  { path: "/types", name: "Types" },
  { path: "/items", name: "Items" },
  { path: "/machines", name: "Machines" },
  { path: "/locations", name: "Locations" },
];

const isCurrentRoute = (path) => route.path === path;
</script>
