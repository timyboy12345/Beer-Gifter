<template>
  <div>
    <h1 class="text-3xl font-bold text-yellow-900">Alle Biertjes</h1>
    <h2 class="text-sm text-gray-600">{{ userStore.beers.length }} biertjes</h2>

    <div class="flex flex-row break-keep whitespace-nowrap overflow-scroll gap-2 my-4">
      <div class="bg-yellow-600 rounded text-white py-1 px-2" v-for="beer of favoriteBeers()">
        {{ beer.name }}: {{ beer.count }}
      </div>
    </div>

    <BeerList :beers="userStore.beers" class="mt-4 mb-8"></BeerList>
  </div>
</template>

<script setup>
import {useUserStore} from "@/stores/user";
import BeerList from "@/components/BeerList.vue";

const userStore = useUserStore();

function favoriteBeers() {
  const beers = [];

  userStore.checkins.forEach((checkin) => {
    const foundBeer = beers.find((l) => l.id === checkin.beer.bid);

    if (!foundBeer) {
      beers.push({
        id: checkin.beer.bid,
        name: checkin.beer.beer_name,
        count: 1
      })
    } else {
      foundBeer.count += 1;
    }
  })

  return beers
      .filter((l) => l.name !== '' && l.id !== '')
      .sort((a, b) => a.count < b.count)
      .slice(0, 6);
}
</script>
