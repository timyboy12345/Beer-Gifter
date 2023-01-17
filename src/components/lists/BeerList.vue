<template>
  <List
      :header="header"
      :subheader="subheader"
      :headerLink="headerLink"
      :is-interactive="true"
      :items="beers"
      :compact="compact"
      @select="handleSelect"
  >
    <template v-slot:img="{ item }">
      <v-lazy-image alt="Logo of beer" :src="item.beer_label" class="w-full h-full object-cover object-center"/>
      <div v-if="userStore.cartIncludes(item)" class="absolute -mt-2 -ml-1 rounded w-4 h-4 bg-yellow-700 flex justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="stroke-gray-100 w-3 h-3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
      </div>
    </template>
    <template v-slot:title="{ item }">{{ item.beer_name }}</template>
    <template v-slot:subtitle="{ item }">{{ item.beer_style }}</template>
    <template v-slot:undertitle="{ item }">ABV: {{ item.beer_abv }} <span v-if="item.score">/ Score: <span
        class="text-primary-800">{{ item.score }}</span></span> <span v-if="item.count">/ <span>{{ $t('generic.drank_x_times', {count: item.count}) }}</span></span>
    </template>
  </List>
</template>

<script>
import List from "./List.vue";
import ListMixin from "../../mixins/ListMixin.js";
import VLazyImage from "v-lazy-image";
import {inject} from "vue";
import {useUserStore} from "@/stores/user";

export default {
  components: {List, VLazyImage},
  mixins: [ListMixin],
  setup() {
    const userStore = useUserStore();
    const showLoadingModal = inject('showLoadingModal');
    const showBeerModal = inject('showBeerModal');
    const getUntappdBeer = inject('getUntappdBeer');

    return { userStore, showBeerModal, showLoadingModal, getUntappdBeer };
  },
  props: {
    beers: {
      type: Array,
      required: true
    },
    shouldHotlink: {
      type: Boolean,
      required: false,
      default: true
    },
  },
  methods: {
    getLink(item) {
      if (!this.shouldHotlink) {
        return null;
      }

      return `https://untappd.com/b/${item.beer_slug}/${item.bid}`;
    },
    handleSelect(beer) {
      this.showLoadingModal();

      this.getUntappdBeer(beer.bid)
          .then((result) => {
            this.showBeerModal(result);
            // localStorage.setItem(cachingKey, JSON.stringify(result));
          })
          .catch((err) => {
            throw err;
          })
    }
  }
}
</script>
