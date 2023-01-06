<script setup lang="ts">
import {useUserStore} from "@/stores/user";

const userStore = useUserStore();
</script>

<template>
  <header class="w-full bg-yellow-600 flex flex-row p-4 text-yellow-900 mb-4">
    <RouterLink to="/" class="font-bold mr-8">Beer Gifter</RouterLink>

    <div class="wrapper">
      <nav class="flex flex-row gap-x-4">
<!--        <RouterLink class="block" v-if="!userStore.isLoggedIn" to="/">Home</RouterLink>-->
        <RouterLink class="block" v-if="userStore.isLoggedIn" to="/untappd/dashboard">Algemene informatie</RouterLink>
        <RouterLink class="block" v-if="userStore.isLoggedIn" to="/untappd/beers">Bieren</RouterLink>
        <RouterLink class="block" v-if="userStore.isLoggedIn" to="/untappd/venues">Locaties</RouterLink>
        <RouterLink class="block" v-if="userStore.isLoggedIn" to="/untappd/checkins">Checkins</RouterLink>
      </nav>
    </div>
  </header>

  <div class="mx-4 sm:mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
    <RouterView/>
  </div>
</template>
