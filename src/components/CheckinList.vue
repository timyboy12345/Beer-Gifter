<template>
  <List :header="header" :items="checkins" :link="getLink">
    <template v-slot:img="{ item }">
      <v-lazy-image v-if="item.media.count > 0" alt="Logo of beer" :src="item.media.items[0].photo.photo_img_sm" class="w-full h-full object-cover object-center" />
      <v-lazy-image v-else alt="Logo of beer" :src="item.beer.beer_label" class="w-full h-full object-cover object-center" />
    </template>
    <template v-slot:title="{ item }">{{ item.beer.beer_name }}: {{ item.rating_score }}</template>
    <template v-slot:subtitle="{ item }">{{ item.beer.beer_style }}</template>
    <template v-slot:undertitle="{ item }">{{ item.checkin_comment }}</template>
  </List>
</template>

<script>
import List from "./List.vue";
import ListMixin from "@/mixins/ListMixin.js";
import VLazyImage from "v-lazy-image";
import {useUserStore} from "@/stores/user";

export default {
  components: {List, VLazyImage},
  mixins: [ListMixin],
  props: {
    checkins: {
      type: Array,
      required: true
    }
  },
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  methods: {
    getLink(item) {
      return `https://untappd.com/user/${this.userStore.userName}/checkin/${item.checkin_id}`;
    }
  }
}
</script>
