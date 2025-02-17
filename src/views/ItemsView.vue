<!-- src/views/ItemsView.vue -->
<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8 sm:py-12">
      <div class="pokeball mx-auto"></div>
    </div>

    <div v-else>
      <!-- Tabs -->
      <div class="mb-6">
        <div class="flex border-b">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="activeTab = tab.value"
            :class="[
              'px-4 py-2 font-medium',
              activeTab === tab.value
                ? 'border-b-2 border-pokemon-cerulean text-pokemon-cerulean'
                : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Search -->
      <div class="bg-white p-4 rounded-lg shadow-md mb-6">
        <div class="grid gap-4">
          <!-- Search Input -->
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                class="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="`Search ${activeTab}...`"
              class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-cerulean focus:border-pokemon-cerulean"
            />
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div
        v-if="activeTab === 'items'"
        class="bg-gray-800 rounded-lg overflow-hidden"
      >
        <table class="w-full text-white">
          <thead>
            <tr>
              <th class="px-4 py-2 text-left">Sprite</th>
              <th
                class="px-4 py-2 text-left cursor-pointer hover:text-pokemon-cerulean"
                @click="sortBy('items', 'name')"
              >
                Name
                <span v-if="sortField === 'name'" class="ml-1">
                  {{ sortOrder === "asc" ? "↑" : "↓" }}
                </span>
              </th>
              <th
                class="px-4 py-2 text-left cursor-pointer hover:text-pokemon-cerulean"
                @click="sortBy('items', 'category')"
              >
                Category
                <span v-if="sortField === 'category'" class="ml-1">
                  {{ sortOrder === "asc" ? "↑" : "↓" }}
                </span>
              </th>
              <th class="px-4 py-2 text-left">Effect</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in paginatedItems"
              :key="item.name"
              class="border-t border-gray-700"
            >
              <td class="px-4 py-2">
                <img :src="item.sprite" :alt="item.name" class="w-8 h-8" />
              </td>
              <td class="px-4 py-2">{{ item.name }}</td>
              <td class="px-4 py-2">{{ item.category }}</td>
              <td class="px-4 py-2">{{ item.effect }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Berries Table -->
      <div v-else class="bg-gray-800 rounded-lg overflow-hidden">
        <table class="w-full text-white">
          <thead>
            <tr>
              <th
                class="px-4 py-2 text-left cursor-pointer hover:text-pokemon-cerulean"
                @click="sortBy('berries', 'name')"
              >
                Name
                <span v-if="sortField === 'name'" class="ml-1">
                  {{ sortOrder === "asc" ? "↑" : "↓" }}
                </span>
              </th>
              <th
                class="px-4 py-2 text-left cursor-pointer hover:text-pokemon-cerulean"
                @click="sortBy('berries', 'firmness')"
              >
                Firmness
                <span v-if="sortField === 'firmness'" class="ml-1">
                  {{ sortOrder === "asc" ? "↑" : "↓" }}
                </span>
              </th>
              <th class="px-4 py-2 text-left">Growth</th>
              <th class="px-4 py-2 text-left">Natural Gift</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="berry in paginatedBerries"
              :key="berry.name"
              class="border-t border-gray-700"
            >
              <td class="px-4 py-2">{{ berry.name }}</td>
              <td class="px-4 py-2">{{ berry.firmness }}</td>
              <td class="px-4 py-2">{{ berry.growth }}</td>
              <td class="px-4 py-2">
                {{ berry.naturalGift.type }} {{ berry.naturalGift.power }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mt-4 flex justify-center">
        <nav class="flex space-x-2">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            v-for="pageNum in visiblePages"
            :key="pageNum"
            @click="changePage(pageNum)"
            :class="[
              'px-3 py-1 rounded',
              currentPage === pageNum
                ? 'bg-pokemon-cerulean text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]"
          >
            {{ pageNum }}
          </button>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { ItemService } from "../services/ItemService";
import type { Item, Berry } from "../types/items";

const items = ref<Item[]>([]);
const berries = ref<Berry[]>([]);
const loading = ref(true);
const activeTab = ref("items");
const searchQuery = ref("");

const tabs = [
  { label: "Items", value: "items" },
  { label: "Berries", value: "berries" },
];

const sortField = ref("name");
const sortOrder = ref<"asc" | "desc">("asc");
const currentPage = ref(1);
const itemsPerPage = 20;

const sortBy = (_tab: "items" | "berries", field: string) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortOrder.value = "asc";
  }
  currentPage.value = 1; // Reset to first page when sorting
};

const filteredItems = computed(() => {
  return items.value.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    return matchesSearch;
  });
});

const filteredBerries = computed(() => {
  return berries.value.filter((berry) =>
    berry.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Sorting logic
const sortedItems = computed(() => {
  const sorted = [...filteredItems.value].sort((a, b) => {
    const aValue = a[sortField.value as keyof typeof a];
    const bValue = b[sortField.value as keyof typeof b];

    if (sortOrder.value === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  return sorted;
});

const sortedBerries = computed(() => {
  const sorted = [...filteredBerries.value].sort((a, b) => {
    const aValue = a[sortField.value as keyof typeof a];
    const bValue = b[sortField.value as keyof typeof b];

    if (sortOrder.value === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  return sorted;
});

// Pagination
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => startIndex.value + itemsPerPage);

const totalPages = computed(() => {
  const total =
    activeTab.value === "items"
      ? sortedItems.value.length
      : sortedBerries.value.length;
  return Math.ceil(total / itemsPerPage);
});

const visiblePages = computed(() => {
  const maxVisiblePages = window.innerWidth < 640 ? 5 : 10;
  const half = Math.floor(maxVisiblePages / 2);
  let start = Math.max(currentPage.value - half, 1);
  let end = Math.min(start + maxVisiblePages - 1, totalPages.value);

  if (end - start < maxVisiblePages - 1) {
    start = Math.max(end - maxVisiblePages + 1, 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const paginatedItems = computed(() =>
  sortedItems.value.slice(startIndex.value, endIndex.value)
);

const paginatedBerries = computed(() =>
  sortedBerries.value.slice(startIndex.value, endIndex.value)
);

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

onMounted(async () => {
  try {
    const [itemsData, berriesData] = await Promise.all([
      ItemService.getAllItems(),
      ItemService.getAllBerries(),
    ]);

    items.value = itemsData;
    berries.value = berriesData;
  } catch (error) {
    console.error("Failed to load data:", error);
  } finally {
    loading.value = false;
  }
});
</script>
