<template>
  <div>
    <FormInput
        :value="i"
        label="Zoek op biernaam"
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

export default {
  components: {Alert, BeerList, FormInput},
  setup() {
    const searchUntappdBeer = inject('searchUntappdBeer');

    return {searchUntappdBeer};
  },
  data() {
    return {
      i: '',
      searching: false,
      foundBeers: null
    }
  },
  methods: {
    search() {
      this.searching = true;
      this.searchUntappdBeer(this.i)
          .then((data) => {
            this.foundBeers = data.beers.items.map((b) => b.beer);
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
