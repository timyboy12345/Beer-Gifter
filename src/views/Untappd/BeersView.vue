<template>
  <div>
    <h1 class="text-3xl font-bold text-yellow-900">Alle Biertjes</h1>
    <h2 class="text-sm text-gray-600">{{ userStore.beers.length }} biertjes</h2>

    <Filters
        class="my-4"
        :items="breweries"
        @select="handleSelect"
        :active-filter-id="activeFilterId"
        header="Favoriete Brouwerijen"
    >
      <template v-slot:filter="{ item }">
        {{ item.brewery_name }}
      </template>
    </Filters>

    <BeerList :beers="beers" class="mt-4 mb-8"></BeerList>
  </div>
</template>

<script>
import {useUserStore} from "@/stores/user";
import BeerList from "@/components/BeerList.vue";
import Filters from "@/components/Filters.vue";

export default {
  data() {
    return {
      activeFilterId: null
    }
  },
  components: {BeerList, Filters},
  setup() {
    const userStore = useUserStore();
    return {userStore};
  },
  computed: {
    beers() {
      return this.activeFilterId
          ? this.userStore.beers.filter((b) => b.brewery && b.brewery.brewery_id === this.activeFilterId)
          : this.userStore.beers.slice(0, 50);
    },
    breweries() {
      return this.userStore.breweries
          .sort((a, b) => a.count < b.count ? 1 : -1)
          .slice(0, 6)
          .map((b) => {
            return {
              ...b,
              id: b.brewery_id
            }
          });
    }
  },
  methods: {
    handleSelect(i) {
      if (i === this.activeFilterId) {
        this.activeFilterId = null;
      } else {
        this.activeFilterId = i;
      }
    }
  }
}
</script>
