<script setup lang="ts">
import {useUserStore} from "@/stores/user";

const userStore = useUserStore();
const appVersion = userStore.version;

function showMenuLinks() {
  return userStore.isLoggedIn && userStore.checkins.length !== 0;
}
</script>

<template>
  <header class="w-full bg-yellow-600 flex flex-col lg:flex-row lg:items-center p-4 text-yellow-900 mb-4">
    <RouterLink to="/" class="font-bold mr-8">
      Beer Gifter
      <span class="text-sm font-light opacity-50">{{ appVersion }}</span>
    </RouterLink>

    <div class="wrapper text-sm lg:text-md lg:md-0">
      <nav class="flex flex-row gap-x-4" v-if="showMenuLinks()">
        <!--        <RouterLink class="block" v-if="!userStore.isLoggedIn" to="/">Home</RouterLink>-->
        <RouterLink class="block" to="/untappd/dashboard">Algemene informatie</RouterLink>
        <RouterLink class="block" to="/untappd/beers">Bieren</RouterLink>
        <RouterLink class="block" to="/untappd/venues">Locaties</RouterLink>
        <RouterLink class="block" to="/untappd/checkins">Checkins</RouterLink>
      </nav>
    </div>
  </header>

  <div class="mx-4 sm:mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
    <RouterView/>
  </div>
</template>
