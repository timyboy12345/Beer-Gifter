<template>
  <div>
    <h1 class="text-3xl font-bold text-yellow-900">Alle Biertjes</h1>
    <h2 class="text-sm text-gray-600">{{ userStore.beers.length }} biertjes</h2>

    <Filters
        class="my-4"
        :items="breweries()"
        @select="handleSelect"
        :active-filter-id="activeFilterId"
        header="Favoriete Brouwerijen"
    >
      <template v-slot:filter="{ item }">
        {{ item.brewery_name }}
      </template>
    </Filters>

    <BeerList :beers="beers()" class="mt-4 mb-8"></BeerList>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useUserStore} from "@/stores/user";
import BeerList from "@/components/BeerList.vue";
import Filters from "@/components/Filters.vue";

const userStore = useUserStore();
const activeFilterId = ref(null);

function favoriteBeers() {
  return userStore.beers
      .filter((l) => l.name !== '' && l.id !== '')
      .sort((a, b) => a.count < b.count ? 1 : -1)
      .slice(0, 6);
}

function beers() {
  return activeFilterId.value
      ? userStore.beers.filter((b) => b.brewery && b.brewery.brewery_id === activeFilterId.value).sort((a, b) => a.count < b.count ? 1 : -1)
      : userStore.beers.sort((a, b) => a.count < b.count ? 1 : -1);
}

function breweries() {
  const breweries = userStore.beers
      .filter((b) => b.brewery)
      .map((b) => b.brewery);

  const uniqueBreweries = [...new Map(breweries.map(item => [item.brewery_name, item])).values()];

  return uniqueBreweries
      .map((brewery) => {
        return {
          ...brewery,
          id: brewery.brewery_id
        }
      })
      .slice(0, 6);
}

function handleSelect(i) {
  if (i === activeFilterId.value) {
    activeFilterId.value = null;
  } else {
    activeFilterId.value = i;
  }
}
</script>
