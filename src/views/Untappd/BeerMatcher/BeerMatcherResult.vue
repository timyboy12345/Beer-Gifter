<template>
  <div v-if="beer">
    <h1 class="text-2xl font-bold text-yellow-800">{{ beer.beer_name }}</h1>
    <h2 class="text-gray-600">{{ beer.beer_style }} / IBU: {{ beer.beer_ibu }} / ABV: {{ beer.beer_abv }}</h2>
    <a
        target="_blank"
        class="text-sm underline text-yellow-600 transition duration:100 hover:text-yellow-700"
        :href="`https://untappd.com/b/${beer.beer_slug}/${beer.bid}`">
      Bekijk op Untappd
    </a>

    <p class="text-gray-800 text-sm mt-2">{{ beer.beer_description }}</p>

    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 my-4">
      <div class="border rounded bg-white p-2">
        <div class="text-xs text-gray-600">Totale Check-ins</div>
        <div class="text-2xl text-yellow-600">{{ beer.stats.total_count }}</div>
      </div>
      <div class="border rounded bg-white p-2">
        <div class="text-xs text-gray-600">Gemiddelde Score</div>
        <div class="text-2xl text-yellow-600">{{ Math.round(beer.weighted_rating_score * 100) / 100 }}</div>
      </div>
      <div class="border rounded bg-white p-2">
        <div class="text-xs text-gray-500">Aantal drinkers</div>
        <div class="text-2xl text-gray-400">{{ beer.stats.total_user_count }}</div>
      </div>
      <div class="border rounded bg-white p-2">
        <div class="text-xs text-gray-500">Check-ins deze maand</div>
        <div class="text-2xl text-gray-400">{{ beer.stats.monthly_count }}</div>
      </div>
      <div class="border rounded bg-white p-2">
        <div class="text-xs text-gray-500">Aantal keer zelf gehad</div>
        <div class="text-2xl text-gray-400">{{ beer.stats.user_count }}</div>
      </div>
      <div class="border rounded bg-white p-2">
        <div class="text-xs text-gray-500">Gebrouwen sinds</div>
        <div class="text-2xl text-gray-400">{{ year }}</div>
      </div>
    </div>

    <Alert
        class="my-8"
        :important="true"
        header="Onze aanbeveling"
        :content="matchText"
    ></Alert>

    <BeerList
        v-if="sameTypeBeers.length > 0"
        class="my-8"
        header="Vergelijkbare biertjes"
        :subheader="`Dit zijn andere biertjes die ${userStore.userName} van dit type heeft gedronken.`"
        :beers="sameTypeBeers"
    ></BeerList>

    <Alert
        v-else
        class="my-8"
        header="Geen vergelijkbare biertjes"
        :content="`We konden geen biertjes vinden die ${userStore.userName} heeft gedronken die vergelijkbaar zijn met dit biertje.`"
        :important="false"
    ></Alert>

    <BeerList
        class="my-8"
        header="Alternatieve biertjes volgens Untappd"
        subheader="Untappd geeft aan dat deze biertjes vergelijkbaar zijn met dit biertje."
        :beers="beer.similar.items.map((b) => b.beer)"
        is-interactive
        :should-hotlink="false"
        @select="handleBeerSelect"
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
import Alert from "../../../components/Alert.vue";
import router from "../../../router";

export default {
  components: {Alert, BeerList, Spinner},
  data() {
    return {
      bid: null,
      beer: null,
      cachingKey: `${this.userStore.userName}_${this.bid}`
    }
  },
  setup() {
    const getUntappdBeer = inject('getUntappdBeer');
    const userStore = useUserStore();

    return {getUntappdBeer, userStore};
  },
  created() {
    this.bid = this.$route.params.id;

    this.$watch(
        () => this.$route.params,
        (toParams, previousParams) => {
          if (toParams.id !== previousParams.id) {
            this.beer = null;

            this.bid = toParams.id;
            this.getBeer();
          }
        }
    )

    if (localStorage.getItem(this.cachingKey)) {
      this.beer = JSON.parse(localStorage.getItem(this.cachingKey));
    } else {
      this.getBeer();
    }
  },
  computed: {
    sameTypeBeers() {
      return this.userStore.beers.filter((b) => b.beer_style === this.beer.beer_style);
    },
    year() {
      return new Date(this.beer.created_at).getFullYear();
    },
    match() {
      const ratedSameBeers = this.sameTypeBeers
          .filter((b) => b.score);

      const score = ratedSameBeers
          .reduce((partialSum, a) => partialSum + a.score, 0) / ratedSameBeers.length;

      return score * 20;
    },
    matchText() {
      const texts = ['Ons oordeel:'];

      if (this.match) {
        texts.push(`${this.userStore.userName} matcht voor ${this.match}% met dit biertje.`);

        if (this.match > 70) {
          texts.push('Moet kunnen!');
        } else if (this.match > 60) {
          texts.push('Kan, maar er kunnen betere opties zijn.');
        } else if (this.match > 50) {
          texts.push('Het past, maar niet fantastisch.');
        } else {
          texts.push('Wij raden het niet aan, maar het zou kunnen dat we er totaal naast zitten.');
        }
      } else {
        texts.push(`${this.userStore.userName} heeft nog niet eerder een vergelijkbaar biertje beoordeeld, dus we kunnen niet inschatten of hij/zij het lekker gaat vinden. Misschien is het een poging waard.`);
      }

      if (this.beer.weighted_rating_score < 2) {
        texts.push('Maar pas op, het biertje wordt niet heel hoog gerate door andere gebruikers. Misschien is er iets vergelijkbaars?');
      } else if (this.beer.weighted_rating_score < 2.5) {
        texts.push('Maar het zou kunnen dat er een biertje is wat beter wordt beoordeeld door andere gebuikers.');
      } else if (this.beer.weighted_rating_score > 4.2) {
        texts.push('Bovendien krijgt dit biertje uitstekende beoordelingen van andere gebruikers, bonuspunten!');
      }

      return texts.join(' ');
    }
  },
  methods: {
    handleBeerSelect(item) {
      router.push({'name': 'untappd-beermatcher-show', params: {'id': item.bid}});
    },
    getBeer() {
      this.getUntappdBeer(this.bid)
          .then((result) => {
            this.beer = result;
            localStorage.setItem(this.cachingKey, JSON.stringify(result));
          })
          .catch((err) => {
            throw err;
          })
    }
  }
}
</script>
