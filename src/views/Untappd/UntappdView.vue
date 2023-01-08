<template>
  <div>
    <h1 class="text-3xl font-bold text-yellow-900">{{ userStore.fullName }}</h1>
    <h2 class="text-sm text-gray-600">Untappd / <a :href="`https://untappd.com/user/${userStore.userName}`"
                                                   class="underline text-yellow-600"
                                                   target="_blank">{{ userStore.userName }}</a></h2>

    <div class="grid lg:grid-cols-2 gap-4 my-4">
      <BeerList header="Favoriete Biertjes" header-link="untappd-beers" :beers="userStore.beers.slice(0, 5)"></BeerList>
      <VenueList header="Favoriete Locaties" header-link="untappd-venues"
                 :venues="userStore.venues.slice(0, 5)"></VenueList>
      <BreweryList header="Favoriete Brouwerijen" :breweries="favoriteBreweries"></BreweryList>
    </div>
  </div>
</template>

<script>
import {useUserStore} from "@/stores/user";
import BeerList from "@/components/BeerList.vue";
import VenueList from "@/components/VenueList.vue";
import BreweryList from "@/components/BreweryList.vue";

export default {
  components: {BeerList, VenueList, BreweryList},
  setup() {
    const userStore = useUserStore();
    return {userStore};
  },
  computed: {
    favoriteBreweries() {
      return this.userStore.breweries.sort((a, b) => a.count < b.count ? 1 : -1).slice(0, 5)
    }
  }
}

// TODO: Favorite styles
// https://github.com/ascholer/bjcp-styleview/blob/main/styles.json
</script>
