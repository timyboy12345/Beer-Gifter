<template>
  <div>
    <h1 class="text-3xl font-bold text-yellow-900">{{ userStore.fullName }}</h1>
    <h2 class="text-sm text-gray-600">Alle data wordt opgehaald...</h2>

    <div class="mt-8 mb-4 text-gray-600 flex flex-row items-center">
      <div class="inline-block">
        <Spinner/>
      </div>
      {{ userStore.checkins.length }} checkins opgehaald.
    </div>
  </div>
</template>

<script setup>
import {inject} from 'vue';

import {useUserStore} from "@/stores/user";
import router from "@/router";
import Spinner from "@/components/Spinner.vue";

const userStore = useUserStore();

const getUntappdUserCheckins = inject('getUntappdUserCheckins')

// TODO: Remove this counter mechanism
let fetches = 0;
const maxTries = 2;

function fetchPage(maxId) {
  userStore.setImporting(true);

  getUntappdUserCheckins(userStore.userName, maxId)
      .then((results) => {
        fetches++;

        userStore.addCheckins(results.checkins.items);

        if (results.pagination.max_id && fetches <= maxTries - 1) {
          fetchPage(results.pagination.max_id);
        } else {
          userStore.recalculate()
              .then(() => {
                userStore.setImporting(false);
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

fetchPage();
</script>
