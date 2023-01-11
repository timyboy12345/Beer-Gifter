<template>
  <div>
    <h1 class="text-3xl font-bold text-yellow-900">{{ userStore.fullName }}</h1>
    <h2 class="text-sm text-gray-600">Untappd / <a :href="`https://untappd.com/user/${userStore.userName}`"
                                                   class="underline text-yellow-600"
                                                   target="_blank">{{ userStore.userName }}</a></h2>

    <FormInput
        class="my-4"
        label="Beer Matcher"
        subheader="Check of een biertje bij de smaak van deze persoon past."
        placeholder="Naam van bier (+ Brouwerij)"
        :value="searchInput"
        @input.self="(e) => searchInput = e"
        @keyup.enter="search()"
    ></FormInput>

    <div class="grid lg:grid-cols-2 gap-4 my-4">
      <BeerList header="Favoriete Biertjes" subheader="Deze biertjes zijn het hoogst beoordeeld."
                header-link="untappd-beers" :beers="favoriteBeers"></BeerList>
      <BeerList header="Meest Gedronken Biertjes" subheader="Deze biertjes zijn het vaakst ingecheckt."
                header-link="untappd-beers" :beers="mostDrankBeers"></BeerList>
      <VenueList header="Favoriete Locaties"
                 subheader="Op deze locaties heeft deze gebruiker het vaakst bier ingecheckt."
                 header-link="untappd-venues" :venues="favoriteVenues"></VenueList>
      <BreweryList header="Favoriete Brouwerijen" subheader="Van deze brouwerijen zijn de meeste biertjes ingecheckt."
                   :breweries="favoriteBreweries"></BreweryList>
    </div>
  </div>
</template>

<script>
import {useUserStore} from "@/stores/user";
import BeerList from "@/components/BeerList.vue";
import VenueList from "@/components/VenueList.vue";
import BreweryList from "@/components/BreweryList.vue";
import FormInput from "../../components/FormInput.vue";
import router from "../../router";

export default {
  components: {FormInput, BeerList, VenueList, BreweryList},
  data() {
    return {
      searchInput: ''
    }
  },
  setup() {
    const userStore = useUserStore();
    return {userStore};
  },
  computed: {
    favoriteBeers() {
      return this.userStore.beers
          .sort((a, b) => a.score < b.score ? 1 : -1)
          .slice(0, 5)
    },
    mostDrankBeers() {
      return this.userStore.beers
          .sort((a, b) => a.count < b.count ? 1 : -1)
          .slice(0, 5)
    },
    favoriteVenues() {
      return this.userStore.venues.sort((a, b) => a.count < b.count ? 1 : -1).slice(0, 5)
    },
    favoriteBreweries() {
      return this.userStore.breweries.sort((a, b) => a.count < b.count ? 1 : -1).slice(0, 5)
    },
  },
  methods: {
    search() {
      router.push({'name': 'untappd-beermatcher-index', query: {'search': this.searchInput}});
    }
  }
}

// TODO: Favorite styles
// https://github.com/ascholer/bjcp-styleview/blob/main/styles.json
</script>
