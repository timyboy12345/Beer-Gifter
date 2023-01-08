<template>
  <List :header="header" :items="breweries" :link="getLink" :headerLink="headerLink">
    <template v-slot:img="{ item }">
      <v-lazy-image alt="Logo of beer" :src="item.brewery_label" class="w-full h-full object-cover object-center" />
    </template>
    <template v-slot:title="{ item }">{{ item.brewery_name }}</template>
    <template v-slot:subtitle="{ item }">{{ item.country_name }}</template>
    <template v-slot:undertitle="{ item }">Biertjes: {{ item.count }}</template>
  </List>
</template>

<script>
import List from "./List.vue";
import ListMixin from "../mixins/ListMixin.js";
import VLazyImage from "v-lazy-image";

export default {
  components: {List, VLazyImage},
  mixins: [ListMixin],
  props: {
    breweries: {
      type: Array,
      required: true
    }
  },
  methods: {
    getLink(item) {
      return `https://untappd.com/${item.brewery_page_url}`;
    }
  }
}
</script>
