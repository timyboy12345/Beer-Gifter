<template>
  <div>
    <h1 class="text-3xl font-bold text-yellow-900">Alle Locaties</h1>
    <h2 class="text-sm text-gray-600">{{ userStore.venues.length }} verschillende locaties</h2>

    <div class="flex flex-row break-keep whitespace-nowrap overflow-scroll gap-2 my-4">
      <div class="bg-yellow-600 rounded text-white py-1 px-2" v-for="location of favoriteCities()">
        {{ location.city }}: {{ location.count }}
      </div>
    </div>

    <VenueList :venues="userStore.venues" class="mt-4 mb-8"></VenueList>
  </div>
</template>

<script setup>
import {useUserStore} from "@/stores/user";
import VenueList from "@/components/VenueList.vue";

const userStore = useUserStore();

function favoriteCities() {
  const locations = [];

  userStore.venues.forEach((venue) => {
    const foundLocation = locations.find((l) => l.city === venue.location.venue_city);

    if (!foundLocation) {
      locations.push({
        city: venue.location.venue_city,
        count: 1
      })
    } else {
      foundLocation.count += 1;
    }
  })

  return locations
      .filter((l) => l.city !== '')
      .sort((a, b) => a.count < b.count)
      .slice(0, 6);
}
</script>
