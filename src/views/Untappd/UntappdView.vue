<template>
  <div>
    <h1 class="text-3xl font-bold text-primary-900">{{ userStore.fullName }}</h1>
    <h2 class="text-sm text-gray-600">Untappd / <a :href="`https://untappd.com/user/${userStore.userName}`"
                                                   class="underline text-primary-600"
                                                   target="_blank">{{ userStore.userName }}</a></h2>

    <FormInput
        class="my-4"
        :label="$t('untappd_home.beermatcher_label')"
        :subheader="$t('untappd_home.beermatcher_content')"
        :placeholder="$t('untappd_home.beermatcher_placeholder')"
        :value="searchInput"
        @input.self="(e) => searchInput = e"
        @keyup.enter="search()"
    ></FormInput>

    <div class="grid lg:grid-cols-2 gap-4 my-4">
      <BeerList :header="$t('untappd_home.favorite_beers_header')"
                :subheader="$t('untappd_home.favorite_beers_subheader')"
                header-link="untappd-beers"
                :beers="favoriteBeers"></BeerList>
      <BeerList :header="$t('untappd_home.most_drank_beers_header')"
                :subheader="$t('untappd_home.most_drank_beers_subheader')"
                header-link="untappd-beers"
                :beers="mostDrankBeers"></BeerList>
      <VenueList :header="$t('untappd_home.favorite_venues_header')"
                 :subheader="$t('untappd_home.favorite_venues_subheader')"
                 header-link="untappd-venues"
                 :venues="favoriteVenues"></VenueList>
      <BreweryList :header="$t('untappd_home.favorite_breweries_header')"
                   :subheader="$t('untappd_home.favorite_breweries_subheader')"
                   :breweries="favoriteBreweries"></BreweryList>
    </div>
  </div>
</template>

<script>
import {useUserStore} from "@/stores/user";
import BeerList from "@/components/lists/BeerList.vue";
import VenueList from "@/components/lists/VenueList.vue";
import BreweryList from "@/components/lists/BreweryList.vue";
import FormInput from "../../components/FormInput.vue";
import router from "../../router";
import {useI18n} from "vue-i18n";
import {useMeta} from "vue-meta";

export default {
  components: {FormInput, BeerList, VenueList, BreweryList},
  data() {
    return {
      searchInput: ''
    }
  },
  setup() {
    const userStore = useUserStore();

    const {t} = useI18n()
    useMeta({
      title: t('untappd_home.seo_title'),
      description: t('untappd_home.seo_description'),
      og: {
        title: t('untappd_home.seo_title'),
        description: t('untappd_home.seo_description')
      },
      htmlAttrs: {lang: 'nl', amp: false}
    })

    return {userStore};
  },
  computed: {
    favoriteBeers() {
      const b = [...this.userStore.beers];

      return b
          .sort((a, b) => a.score < b.score ? 1 : -1)
          .slice(0, 5)
    },
    mostDrankBeers() {
      const b = [...this.userStore.beers];

      return b
          .sort((a, b) => a.count < b.count ? 1 : -1)
          .slice(0, 5)
    },
    favoriteVenues() {
      return this.userStore.venues.sort((a, b) => a.count < b.count ? 1 : -1).slice(0, 5)
    },
    favoriteBreweries() {
      return this.userStore.breweries.sort((a, b) => a.count < b.count ? 1 : -1).slice(0, 5)
    },
  },
  methods: {
    search() {
      router.push({'name': 'untappd-beermatcher-index', query: {'search': this.searchInput}});
    }
  }
}

// TODO: Favorite styles
// https://github.com/ascholer/bjcp-styleview/blob/main/styles.json
</script>
