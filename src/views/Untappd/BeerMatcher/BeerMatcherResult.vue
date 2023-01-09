<template>
  <div v-if="beer">
    <h1 class="text-2xl font-bold text-yellow-800">{{ beer.beer_name }}</h1>
    <h2 class="text-gray-600">{{ beer.beer_style }} / IBU: {{ beer.beer_ibu }} / ABV: {{ beer.beer_abv }}</h2>
    <p class="text-gray-800 text-sm mt-2">{{ beer.beer_description }}</p>

    <BeerList
        v-if="sameTypeBeers.length > 0"
        class="my-8"
        :header="`Andere biertjes die ${userStore.userName} van dit type heeft gedronken`"
        :beers="sameTypeBeers"
    ></BeerList>

    <BeerList
        class="my-8"
        header="Alternatieve biertjes volgens Untappd"
        :beers="beer.similar.items.map((b) => b.beer)"
    ></BeerList>
  </div>

  <div v-else>
    <div class="mt-8 mb-4 text-gray-600 flex flex-row items-center">
      <div class="inline-block">
        <Spinner/>
      </div>

      Data van bier wordt opgehaald.
    </div>
  </div>
</template>

<script>


import {inject} from "vue";
import Spinner from "../../../components/Spinner.vue";
import BeerList from "../../../components/BeerList.vue";
import {useUserStore} from "../../../stores/user";

export default {
  components: {BeerList, Spinner},
  data() {
    return {
      bid: null,
      beer: null
    }
  },
  setup() {
    const getUntappdBeer = inject('getUntappdBeer');
    const userStore = useUserStore();

    return {getUntappdBeer, userStore};
  },
  created() {
    this.bid = this.$route.params.id;

    const key = `${this.userStore.userName}_${this.bid}`;
    if (localStorage.getItem(key)) {
      this.beer = JSON.parse(localStorage.getItem(key));
    } else {
      this.getUntappdBeer(this.bid)
          .then((result) => {
            this.beer = result;
            localStorage.setItem(key, JSON.stringify(result));
          })
          .catch((err) => {
            throw err;
          })
    }
  },
  computed: {
    sameTypeBeers() {
      return this.userStore.beers.filter((b) => b.beer_style === this.beer.beer_style);
    }
  }
}
</script>
