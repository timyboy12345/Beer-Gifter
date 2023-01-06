<template>
  <div>
    <h1 class="text-3xl font-bold text-yellow-900">{{ userStore.fullName }}</h1>
    <h2 class="text-sm text-gray-600">Untappd / <a :href="`https://untappd.com/user/${userStore.userName}`" class="underline text-yellow-600" target="_blank">{{ userStore.userName }}</a></h2>

    <div class="grid lg:grid-cols-2 gap-4 my-4">
      <div>
        <BeerList header="Favoriete Biertjes" :beers="userStore.beers.slice(0, 5)"></BeerList>
        <RouterLink
            :to="{name: 'untappd-beers'}"
            class="block rounded bg-yellow-600 text-white py-2 px-4 mt-2">
          Bekijk alle biertjes
        </RouterLink>
      </div>

      <div>
        <VenueList header="Favoriete Locaties" :venues="userStore.venues.slice(0, 5)"></VenueList>
        <RouterLink
            :to="{name: 'untappd-venues'}"
            class="block rounded bg-yellow-600 text-white py-2 px-4 mt-2">
          Bekijk alle locaties
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useUserStore} from "@/stores/user";
import BeerList from "@/components/BeerList.vue";
import VenueList from "@/components/VenueList.vue";

const userStore = useUserStore();
</script>
