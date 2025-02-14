// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/pokemon",
  },
  {
    path: "/pokemon",
    name: "Pokemon",
    component: () => import("../views/PokemonView.vue"),
  },
  // {
  //   path: '/moves',
  //   name: 'Moves',
  //   component: () => import('../views/MovesView.vue')
  // },
  // {
  //   path: '/abilities',
  //   name: 'Abilities',
  //   component: () => import('../views/AbilitiesView.vue')
  // },
  // {
  //   path: '/types',
  //   name: 'Types',
  //   component: () => import('../views/TypesView.vue')
  // },
  // {
  //   path: '/items',
  //   name: 'Items',
  //   component: () => import('../views/ItemsView.vue')
  // },
  // {
  //   path: '/machines',
  //   name: 'Machines',
  //   component: () => import('../views/MachinesView.vue')
  // },
  // {
  //   path: '/locations',
  //   name: 'Locations',
  //   component: () => import('../views/LocationsView.vue')
  // }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
