<template>
  <div>
    <h1 class="text-3xl font-bold text-primary-900">{{ userStore.fullName }}</h1>
    <h2 class="text-sm text-gray-600">{{ $t('untappd_loading.being_retrieved') }}</h2>

    <div class="mt-8 mb-4 text-gray-600 flex flex-row items-center">
      <div class="inline-block">
        <Spinner/>
      </div>
      {{ $t('untappd_loading.status', {count: userStore.checkins.length}) }}
    </div>
  </div>
</template>

<script>
import {inject} from 'vue';

import {useUserStore} from "@/stores/user";
import router from "@/router";
import Spinner from "@/components/Spinner.vue";
import {useI18n} from "vue-i18n";
import {useMeta} from "vue-meta";

export default {
  data() {
    return {
      // TODO: Remove this counter mechanism
      fetches: 0,
      maxTries: 4
      // maxTries: (typeof process === 'object' && process.env.ENVIRONMENT === 'production') ? 4 : 1
    }
  },
  components: {Spinner},
  setup() {
    const userStore = useUserStore();
    const getUntappdUserCheckins = inject('getUntappdUserCheckins')

    const {t} = useI18n()
    useMeta({
      title: t('untappd_loading.seo_title'),
      description: t('untappd_loading.seo_description'),
      og: {
        title: t('untappd_loading.seo_title'),
        description: t('untappd_loading.seo_description')
      },
      htmlAttrs: {lang: 'nl', amp: false}
    })

    return {userStore, getUntappdUserCheckins}
  },
  created() {
    this.fetchPage();
  },
  methods: {
    fetchPage(maxId) {
      this.userStore.setImporting(true);

      this.getUntappdUserCheckins(this.userStore.userName, maxId)
          .then((results) => {
            this.fetches++;

            this.userStore.addCheckins(results.checkins.items);

            if (results.pagination.max_id && this.fetches <= this.maxTries - 1) {
              this.fetchPage(results.pagination.max_id);
            } else {
              this.userStore.recalculate()
                  .then(() => {
                    this.userStore.setImporting(false);
                    router.push({name: 'untappd-dashboard'});
                  });
            }
          })
          .catch((err) => {
            console.error(err);
            alert("Could not retrieve all beers, but we're using what we did retrieve.");
            router.push({name: 'untappd-dashboard'});
          });
    }
  }
}
</script>
