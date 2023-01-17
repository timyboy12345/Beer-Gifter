<template>
  <div v-if="beer">
    <h1 class="text-2xl font-bold text-primary-800">{{ beer.beer_name }}</h1>
    <h2 class="text-gray-600">{{ beer.beer_style }} / IBU: {{ beer.beer_ibu }} / ABV: {{ beer.beer_abv }}</h2>
    <a
        target="_blank"
        class="text-sm underline text-primary-600 transition duration:100 hover:text-primary-700"
        :href="`https://untappd.com/b/${beer.beer_slug}/${beer.bid}`">
      {{ $t('beermatch_modal.show_on_untappd') }}
    </a>

    <p class="text-gray-800 text-sm mt-2">{{ beer.beer_description }}</p>

    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 my-4">
      <div class="border rounded bg-white p-2">
        <div class="text-xs text-gray-600">{{ $t('beermatch_modal.total_checkins') }}</div>
        <div class="text-2xl text-primary-600">{{ beer.stats.total_count }}</div>
      </div>
      <div class="border rounded bg-white p-2">
        <div class="text-xs text-gray-600">{{ $t('beermatch_modal.average_scores') }}</div>
        <div class="text-2xl text-primary-600">{{ Math.round(beer.weighted_rating_score * 100) / 100 }}
          <span class="text-gray-400 text-sm">/ 5</span>
        </div>
      </div>
      <div class="border rounded bg-white p-2">
        <div class="text-xs text-gray-500">{{ $t('beermatch_modal.total_drinkers') }}</div>
        <div class="text-2xl text-gray-400">{{ beer.stats.total_user_count }}</div>
      </div>
      <div class="border rounded bg-white p-2">
        <div class="text-xs text-gray-500">{{ $t('beermatch_modal.total_checkins_this_month') }}</div>
        <div class="text-2xl text-gray-400">{{ beer.stats.monthly_count }}</div>
      </div>
      <div class="border rounded bg-white p-2">
        <div class="text-xs text-gray-500">{{ $t('beermatch_modal.did_you_drink_it') }}</div>
        <div class="text-2xl text-gray-400">{{ beer.stats.user_count > 0 ? 'Ja' : 'Nee' }}</div>
      </div>
      <div class="border rounded bg-white p-2">
        <div class="text-xs text-gray-500">{{ $t('beermatch_modal.brewed_since')}}</div>
        <div class="text-2xl text-gray-400">{{ year }}</div>
      </div>
    </div>

    <Alert
        class="my-8"
        :important="true"
        :header="$t('beermatch_modal.our_recommendation')"
        :content="matchText"
        unsafe-rendering
    ></Alert>

    <button
        v-if="!userStore.cartIncludes(beer)"
        class="block w-full rounded bg-yellow-600 hover:bg-yellow-700 transition duration:100 text-white py-2 px-4"
        @click="userStore.addToCart(beer)"
    >{{ $t('beermatch_modal.add_to_cart') }}</button>

    <button
        v-else
        class="block w-full rounded bg-red-600 hover:bg-red-700 transition duration:100 text-white py-2 px-4"
        @click="userStore.removeFromCart(beer)"
    >{{ $t('beermatch_modal.remove_from_cart') }}</button>

    <BeerList
        v-if="sameTypeBeers.length > 0"
        :beers="sameTypeBeers"
        :header="$t('beermatch_modal.same_type_beers_header')"
        :subheader="$t('beermatch_modal.same_type_beers_subheader', {name: userStore.userName})"
        class="my-8"
        compact
    ></BeerList>

    <Alert
        v-else
        :content="$t('beermatch_modal.no_same_type_beers_found_content', {name: userStore.userName})"
        :header="$t('beermatch_modal.no_same_type_beers_found_header')"
        :important="false"
        class="my-8"
    ></Alert>

    <BeerList
        class="my-8"
        :header="$t('beermatch_modal.alternative_beers_header')"
        :subheader="$t('beermatch_modal.alternative_beers_subheader')"
        :beers="beer.similar.items.map((b) => b.beer)"
        is-interactive
        :should-hotlink="false"
    ></BeerList>
  </div>
</template>

<script>
import Spinner from "../Spinner.vue";
import BeerList from "../lists/BeerList.vue";
import {useUserStore} from "@/stores/user";
import Alert from "../Alert.vue";

export default {
  components: {Alert, BeerList, Spinner},
  props: {
    beer: {
      type: Object,
      required: true
    }
  },
  setup() {
    const userStore = useUserStore();

    return {userStore};
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

      return Math.round(score * 2000) / 100;
    },
    matchText() {
      const texts = [];

      const double = this.userStore.beers.find((b) => b.bid === this.beer.bid)
      if (double) {
        texts.push(`<span class="italic">` + this.$t('beermatch_modal.match.already_drank', {name: this.userStore.userName}));

        if (double.score) {
          texts.push(this.$t('beermatch_modal.match.already_drank_score', {score: double.score}));
        }

        texts.push(this.$t('beermatch_modal.match.already_drank_info'));

        texts.push('</span><br>');
        texts.push('<br>');
      }

      texts.push(this.$t('beermatch_modal.match.our_advice'));

      if (this.match) {
        texts.push(this.$t('beermatch_modal.match.our_advice_general', {name: this.userStore.userName, score: this.match}));

        if (this.match > 70) {
          texts.push(this.$t('beermatch_modal.match.headline.70'));
        } else if (this.match > 60) {
          texts.push(this.$t('beermatch_modal.match.headline.60'));
        } else if (this.match > 50) {
          texts.push(this.$t('beermatch_modal.match.headline.50'));
        } else {
          texts.push(this.$t('beermatch_modal.match.headline.lower'));
        }
      } else {
        texts.push(this.$t('beermatch_modal.match.no_similar_beers'));
      }

      if (this.beer.weighted_rating_score < 2) {
        texts.push(this.$t('beermatch_modal.match.weighted_rating_score.2'));
      } else if (this.beer.weighted_rating_score < 2.5) {
        texts.push(this.$t('beermatch_modal.match.weighted_rating_score.2.5'));
      } else if (this.beer.weighted_rating_score > 4.2) {
        texts.push(this.$t('beermatch_modal.match.weighted_rating_score.4.2'));
      }

      return texts.join(' ');
    }
  }
}
</script>
