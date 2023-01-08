<template>
  <header class="w-full bg-yellow-600 flex flex-col lg:flex-row lg:items-center p-4 mb-4">
    <RouterLink to="/" class="font-bold mr-8 text-yellow-900">
      Beer Gifter
      <span class="text-sm font-light opacity-50">v{{ appVersion }}</span>
    </RouterLink>

    <div class="wrapper text-sm lg:text-md lg:md-0 text-yellow-700">
      <nav class="flex flex-row gap-x-4" v-if="showMenuLinks">
        <!--        <RouterLink class="block" v-if="!userStore.isLoggedIn" to="/">Home</RouterLink>-->
        <RouterLink active-class="text-yellow-900" class="hover:text-yellow-800 transition duration:100 block"
                    to="/untappd/dashboard">Algemene informatie
        </RouterLink>
        <RouterLink active-class="text-yellow-900" class="hover:text-yellow-800 transition duration:100 block"
                    to="/untappd/beers">Bieren
        </RouterLink>
        <RouterLink active-class="text-yellow-900" class="hover:text-yellow-800 transition duration:100 block"
                    to="/untappd/venues">Locaties
        </RouterLink>
        <RouterLink active-class="text-yellow-900" class="hover:text-yellow-800 transition duration:100 block"
                    to="/untappd/checkins">Checkins
        </RouterLink>
      </nav>
    </div>
  </header>

  <div class="mx-4 sm:mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
    <RouterView/>
  </div>
</template>

<script>
import {useUserStore} from "@/stores/user";

export default {
  setup() {
    const userStore = useUserStore();
    const appVersion = userStore.version;

    return {userStore, appVersion}
  },
  computed: {
    showMenuLinks() {
      return this.userStore.importing === false && this.userStore.isLoggedIn && this.userStore.checkins.length !== 0;
    }
  }
}
</script>
