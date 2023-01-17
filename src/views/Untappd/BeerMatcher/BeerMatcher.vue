<template>
  <div>
    <h1 class="text-2xl font-bold text-primary-800">{{ $t('untappd_beermatcher.header') }}</h1>
    <p class="text-gray-800 text-sm mt-2">{{ $t('untappd_beermatcher.content', {name: userStore.userName}) }}</p>

    <FormInput
        class="mt-8"
        :value="i"
        :label="$t('untappd_beermatcher.input_label')"
        :placeholder="$t('untappd_beermatcher.input_placeholder')"
        @input.self="(e) => i = e"
        @keyup.enter="search()"
        :disabled="searching"
    ></FormInput>

    <BeerList
        class="my-4"
        v-if="foundBeers && foundBeers.length > 0"
        :beers="foundBeers"
        :header="$t('untappd_beermatcher.found_beers_header')"
        :subheader="$t('untappd_beermatcher.found_beers_subheader', {count: foundBeers.length})"
        @select.self="handleSelect"
        :should-hotlink="false"
        :is-interactive="true"
    ></BeerList>

    <Alert
        class="mt-4"
        v-if="foundBeers && foundBeers.length === 0"
        :header="$t('untappd_beermatcher.no_beers_found_header')"
        :content="$t('untappd_beermatcher.no_beers_found_content')"
    ></Alert>
  </div>
</template>
<script>
import FormInput from "../../../components/FormInput.vue";
import BeerList from "../../../components/lists/BeerList.vue";
import Alert from "../../../components/Alert.vue";
import {inject} from "vue";
import {useUserStore} from "../../../stores/user";
import {useModalStore} from "../../../stores/modal";

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
    const modalStore = useModalStore();

    return {searchUntappdBeer, userStore, modalStore};
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
      // router.push({name: 'untappd-beermatcher-show', params: {id: beer.bid}});
      this.modalStore.addBeer(beer.bid);
    }
  }
}
</script>
