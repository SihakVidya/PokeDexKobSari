// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import PokemonView from "../views/PokemonView.vue";
import PokemonDetailView from "../views/PokemonDetailView.vue";
import MovesView from "../views/MovesView.vue";
import AbilitiesView from "../views/AbilitiesView.vue";
import AbilityDetailView from "../views/AbilityDetailView.vue";
import TypesView from "../views/TypesView.vue";
import TypeDetailView from "../views/TypeDetailView.vue";
import ItemsView from "../views/ItemsView.vue";

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
    {
      path: "/moves",
      name: "moves",
      component: MovesView,
    },
    {
      path: "/abilities",
      name: "abilities",
      component: AbilitiesView,
    },
    {
      path: "/abilities/:name",
      name: "ability-detail",
      component: AbilityDetailView,
    },
    {
      path: "/types",
      name: "types",
      component: TypesView,
    },
    {
      path: "/types/:name",
      name: "type-detail",
      component: TypeDetailView,
    },
    {
      path: "/items",
      name: "items",
      component: ItemsView,
    },
  ],
});

export default router;
