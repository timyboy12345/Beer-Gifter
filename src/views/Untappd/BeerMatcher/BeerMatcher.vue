<template>
  <div>
    <h1 class="text-2xl font-bold text-yellow-800">Beer Matcher</h1>
    <p class="text-gray-800 text-sm mt-2">Zoek op deze pagina naar een biertje wat je ergens ziet staan en kijk of het matcht met wat {{ userStore.userName }} normaal drinkt.</p>

    <FormInput
        class="mt-8"
        :value="i"
        label="Zoek op biernaam"
        placeholder="Naam van biertje"
        @input.self="(e) => i = e"
        @keyup.enter="search()"
        :disabled="searching"
    ></FormInput>

    <BeerList
        class="my-4"
        v-if="foundBeers && foundBeers.length > 0"
        :beers="foundBeers"
        header="Gevonden biertjes"
        :subheader="`${foundBeers.length} biertjes gevonden`"
        @select.self="handleSelect"
        :should-hotlink="false"
        :is-interactive="true"
    ></BeerList>

    <Alert
        class="mt-4"
        v-if="foundBeers && foundBeers.length === 0"
        header="Geen biertjes gevonden"
        content="Er zijn geen biertjes gevonden voor deze zoekterm. Probeer een andere zoekterm, het zoeken werkt het best als je de volgende structuur aanhoudt: '[Biernaam] [Brouwerij]'"
    ></Alert>
  </div>
</template>
<script>
import FormInput from "../../../components/FormInput.vue";
import BeerList from "../../../components/BeerList.vue";
import Alert from "../../../components/Alert.vue";
import {inject} from "vue";
import router from "../../../router";
import {useUserStore} from "../../../stores/user";

export default {
  components: {Alert, BeerList, FormInput},
  data() {
    return {
      i: '',
      searching: false,
      foundBeers: null
    }
  },
  setup() {
    const searchUntappdBeer = inject('searchUntappdBeer');
    const userStore = useUserStore();

    return {searchUntappdBeer, userStore};
  },
  created() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    if (params.search) {
      this.i = params.search;
      this.search();
      return;
    }

    if (sessionStorage.getItem('beer_search_results')) {
      this.i = sessionStorage.getItem('beer_search_query');
      this.foundBeers = JSON.parse(sessionStorage.getItem('beer_search_results'));

      return;
    }
  },
  methods: {
    search() {
      this.searching = true;
      this.searchUntappdBeer(this.i)
          .then((data) => {
            this.foundBeers = data.beers.items.map((b) => b.beer);
            sessionStorage.setItem('beer_search_query', this.i);
            sessionStorage.setItem('beer_search_results', JSON.stringify(this.foundBeers));
          })
          .catch((err) => {
            throw err;
          })
          .then(() => {
            this.searching = false;
          });
    },
    handleSelect(beer) {
      router.push({name: 'untappd-beermatcher-show', params: {id: beer.bid}});
    }
  }
}
</script>
