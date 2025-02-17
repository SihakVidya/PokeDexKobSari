// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import PokemonView from "../views/PokemonView.vue";
import PokemonDetailView from "../views/PokemonDetailView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "pokemon",
      component: PokemonView,
    },
    {
      path: "/pokemon/:id",
      name: "pokemon-detail",
      component: PokemonDetailView,
    },
    {
      path: "/pokemon",
      redirect: "/",
    },
  ],
});

export default router;
