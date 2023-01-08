<template>
  <div>
    <h1 class="text-3xl font-bold text-yellow-900">Alle Locaties</h1>
    <h2 class="text-sm text-gray-600">{{ userStore.venues.length }} verschillende locaties</h2>

    <Filters
        class="my-4"
        :items="favoriteCities()"
        @select="handleSelect"
        :active-filter-id="activeFilterId"
        header="Favoriete Steden"
    >
      <template v-slot:filter="{ item }">
        {{ item.venue_city }}
      </template>
    </Filters>

    <VenueList :venues="filteredVenues()" class="mt-4 mb-8"></VenueList>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useUserStore} from "@/stores/user";
import Filters from "@/components/Filters.vue";
import VenueList from "@/components/VenueList.vue";

const userStore = useUserStore();
let activeFilterId = ref(null);

function favoriteCities() {
  const locations = userStore.venues
      .filter((l) => l.location && l.location.venue_city !== '')
      .map((v) => v.location);

  const uniqueLocations = [...new Map(locations.map(item => [item.venue_city, item])).values()];

  return uniqueLocations
      .map((l) => {
        return {
          ...l,
          id: l.venue_city,
          count: userStore.venues.filter((v) => v.location.venue_city === l.venue_city).length
        }
      })
      .sort((a, b) => a.count < b.count ? 1 : -1)
      .slice(0, 6);
}

function filteredVenues() {
  return activeFilterId.value ?
      userStore.venues.filter((v) => v.location.venue_city === activeFilterId.value)
      : userStore.venues;
}

function handleSelect(i) {
  if (i === activeFilterId.value) {
    activeFilterId.value = null;
  } else {
    activeFilterId.value = i;
  }
}
</script>
