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
    </template>
    <template v-slot:title="{ item }">{{ item.beer_name }}</template>
    <template v-slot:subtitle="{ item }">{{ item.beer_style }}</template>
    <template v-slot:undertitle="{ item }">ABV: {{ item.beer_abv }} <span v-if="item.score">/ Score: <span
        class="text-primary-800">{{ item.score }}</span></span> <span v-if="item.count">/ <span>{{ item.count }}x gedronken</span></span>
    </template>
  </List>
</template>

<script>
import List from "./List.vue";
import ListMixin from "../../mixins/ListMixin.js";
import VLazyImage from "v-lazy-image";
import {inject} from "vue";

export default {
  components: {List, VLazyImage},
  mixins: [ListMixin],
  setup() {
    const showLoadingModal = inject('showLoadingModal');
    const showBeerModal = inject('showBeerModal');
    const getUntappdBeer = inject('getUntappdBeer');

    return { showBeerModal, showLoadingModal, getUntappdBeer };
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
