<template>
  <List :header="header" :items="beers" :link="getLink">
    <template v-slot:img="{ item }">
      <v-lazy-image alt="Logo of beer" :src="item.beer_label" class="w-full h-full object-cover object-center" />
    </template>
    <template v-slot:title="{ item }">{{ item.beer_name }}</template>
    <template v-slot:subtitle="{ item }">{{ item.beer_style }}</template>
    <template v-slot:undertitle="{ item }">ABV: {{ item.beer_abv }}</template>
  </List>
</template>

<script>
import List from "./List.vue";
import ListMixin from "@/mixins/ListMixin.js";
import VLazyImage from "v-lazy-image";

export default {
  components: {List, VLazyImage},
  mixins: [ListMixin],
  props: {
    beers: {
      type: Array,
      required: true
    }
  },
  methods: {
    getLink(item) {
      return `https://untappd.com/b/${item.beer_slug}/${item.bid}`;
    }
  }
}
</script>
