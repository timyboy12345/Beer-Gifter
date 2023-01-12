<template>
  <div>
    <h1 class="text-3xl font-bold text-primary-900">{{ userStore.fullName }}</h1>
    <h2 class="text-sm text-gray-600">Alle data wordt opgehaald...</h2>

    <div class="mt-8 mb-4 text-gray-600 flex flex-row items-center">
      <div class="inline-block">
        <Spinner/>
      </div>
      {{ userStore.checkins.length }} checkins opgehaald.
    </div>
  </div>
</template>

<script>
import {inject} from 'vue';

import {useUserStore} from "@/stores/user";
import router from "@/router";
import Spinner from "@/components/Spinner.vue";

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
