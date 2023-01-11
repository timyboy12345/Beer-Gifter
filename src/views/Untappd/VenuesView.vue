<template>
  <div>
    <h1 class="text-3xl font-bold text-yellow-900">Alle Locaties</h1>
    <h2 class="text-sm text-gray-600">{{ userStore.venues.length }} verschillende locaties</h2>

    <Filters
        class="my-4"
        :items="favoriteCities"
        @select="handleSelect"
        :active-filter-id="activeFilterId"
        header="Favoriete Steden"
    >
      <template v-slot:filter="{ item }">
        {{ item.venue_city }}
      </template>
    </Filters>

    <div class="grid lg:grid-cols-2 gap-4">
      <VenueList :venues="filteredVenues" class="mt-4 mb-8"></VenueList>

      <div class="h-64 w-full rounded overflow-hidden border border-gray-100">
        <l-map :min-zoom="0" :max-zoom="10" :center="[0, 0]" ref="map" class="w-full h-full">
          <l-tile-layer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              layer-type="base"
              name="OpenStreetMap"
          ></l-tile-layer>

          <l-marker v-for="marker of filteredVenues" :name="marker.venue_name"
                    :lat-lng="[marker.location.lat, marker.location.lng]"></l-marker>
        </l-map>
      </div>
    </div>
  </div>
</template>

<script>
import {useUserStore} from "@/stores/user";
import Filters from "@/components/Filters.vue";
import VenueList from "@/components/VenueList.vue";
import "leaflet/dist/leaflet.css";
import {LMap, LMarker, LTileLayer} from "@vue-leaflet/vue-leaflet";

export default {
  data() {
    return {
      activeFilterId: null,
      zoom: 2,
    }
  },
  components: {Filters, VenueList, LMap, LTileLayer, LMarker},
  setup() {
    const userStore = useUserStore();
    return {userStore}
  },
  computed: {
    favoriteCities() {
      const locations = this.userStore.venues
          .filter((l) => l.location && l.location.venue_city !== '')
          .map((v) => v.location);

      const uniqueLocations = [...new Map(locations.map(item => [item.venue_city, item])).values()];

      return uniqueLocations
          .map((l) => {
            return {
              ...l,
              id: l.venue_city,
              count: this.userStore.venues.filter((v) => v.location && v.location.venue_city === l.venue_city).length
            }
          })
          .sort((a, b) => a.count < b.count ? 1 : -1)
          .slice(0, 6);
    },
    filteredVenues() {
      return this.activeFilterId ?
          this.userStore.venues.filter((v) => v.location.venue_city === this.activeFilterId)
          : this.userStore.venues;
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
