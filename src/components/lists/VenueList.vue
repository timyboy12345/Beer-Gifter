<template>
  <List :header="header" :subheader="subheader" :items="venues" :link="getLink" :headerLink="headerLink">
    <template v-slot:img="{ item }">
      <v-lazy-image alt="Logo of beer" :src="item.venue_icon.lg" class="w-full h-full object-cover object-center"/>
    </template>
    <template v-slot:title="{ item }">{{ item.venue_name }}</template>
    <template v-slot:subtitle="{ item }">{{ item.primary_category }}</template>
    <template v-slot:undertitle="{ item }">{{ getLocation(item) }}</template>
  </List>
</template>

<script>
import List from "./List.vue";
import ListMixin from "../../mixins/ListMixin.js";
import VLazyImage from "v-lazy-image";

export default {
  components: {List, VLazyImage},
  mixins: [ListMixin],
  props: {
    venues: {
      type: Array,
      required: true
    }
  },
  methods: {
    getLink(item) {
      return `https://untappd.com/v/${item.venue_slug}/${item.venue_id}`;
    },
    getLocation(item) {
      const a = [];

      if (item.location.venue_city) {
        a.push(item.location.venue_city);
      }

      if (item.location.venue_state) {
        a.push(item.location.venue_state);
      }

      if (item.location.venue_country) {
        a.push(item.location.venue_country);
      }

      return a.join(', ');
    }
  }
}
</script>
