<template>
  <header class="bg-pokemon-cerulean shadow-lg sticky top-0 z-50">
    <nav class="container mx-auto px-4">
      <div class="flex items-center justify-between h-14 sm:h-16">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center">
          <router-link
            to="/"
            class="text-pokemon-yellow font-pokemon text-xl sm:text-2xl md:text-3xl tracking-widest drop-shadow-lg flex items-center gap-2"
          >
            <span class="hidden sm:inline">Pokédex</span>
            <span class="sm:hidden">PokeDex Kob Sari</span>
            <span class="hidden md:inline">Kob Sari</span>
            <img
              src="../assets/images/pokeball.gif"
              alt="Pokéball"
              class="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 inline-block"
            />
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:block">
          <div class="flex items-center space-x-2 lg:space-x-4">
            <router-link
              v-for="route in routes"
              :key="route.path"
              :to="route.path"
              class="text-white font-space px-2 lg:px-3 py-2 rounded-md text-sm font-medium hover:bg-pokemon-bu-red transition-colors"
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
            class="text-white hover:text-pokemon-yellow focus:outline-none p-2"
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
      <div
        v-if="isOpen"
        class="md:hidden absolute left-0 right-0 bg-pokemon-cerulean border-t border-pokemon-bu-red"
      >
        <div class="px-2 pt-2 pb-3 space-y-1 shadow-lg">
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
import { ref, onMounted, onUnmounted } from "vue";
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

// Close mobile menu when clicking outside
const handleClickOutside = (event) => {
  if (isOpen.value && !event.target?.closest("nav")) {
    isOpen.value = false;
  }
};

// Close mobile menu when resizing to desktop view
const handleResize = () => {
  if (window.innerWidth >= 768 && isOpen.value) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("resize", handleResize);
});
</script>
