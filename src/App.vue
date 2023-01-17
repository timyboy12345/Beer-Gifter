<template>
  <metainfo>
    <template v-slot:title="{ content }">{{ content ? `${content} | Beer Gifter` : `Beer Gifter` }}</template>
  </metainfo>

  <header class="w-full bg-primary-600 flex flex-col lg:flex-row lg:items-center p-4 mb-4">
    <LocalizedRouterLink name="home" class="font-bold mr-8 text-primary-900">
      Beer Gifter
      <span class="text-sm font-light opacity-50">v{{ appVersion }}</span>
    </LocalizedRouterLink>

    <div class="wrapper text-sm lg:text-md lg:md-0 text-primary-700">
      <nav class="flex flex-row gap-x-4 break-keep whitespace-nowrap overflow-scroll" v-if="showMenuLinks">
        <!--        <RouterLink class="block" v-if="!userStore.isLoggedIn" to="/">Home</RouterLink>-->
        <LocalizedRouterLink active-class="text-primary-900"
                             class="hover:text-primary-800 transition duration:100 block"
                             name="untappd-dashboard">
          {{ $t('generic.genericInformation') }}
        </LocalizedRouterLink>
        <LocalizedRouterLink active-class="text-primary-900"
                             class="hover:text-primary-800 transition duration:100 block"
                             name="untappd-beers">
          {{ $t('generic.beers') }}
        </LocalizedRouterLink>
        <LocalizedRouterLink active-class="text-primary-900"
                             class="hover:text-primary-800 transition duration:100 block"
                             name="untappd-venues">
          {{ $t('generic.venues') }}
        </LocalizedRouterLink>
        <LocalizedRouterLink active-class="text-primary-900"
                             class="hover:text-primary-800 transition duration:100 block"
                             name="untappd-checkins">
          {{ $t('generic.checkins') }}
        </LocalizedRouterLink>
        <LocalizedRouterLink active-class="text-primary-900"
                             class="hover:text-primary-800 transition duration:100 block"
                             name="untappd-beermatcher-index">
          {{ $t('generic.beerMatcher') }}
        </LocalizedRouterLink>
        <LocalizedRouterLink active-class="text-primary-900"
                             class="hover:text-primary-800 transition duration:100 block"
                             name="untappd-cart">
          {{ $t('generic.cart') }}
        </LocalizedRouterLink>
      </nav>
    </div>
  </header>

  <div class="mx-4 sm:mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
    <RouterView/>

    <transition>
      <div v-if="showModal" class="fixed z-100 left-0 top-0 right-0 bottom-0">
        <div @click="closeModal" class="bg-gray-800 bg-opacity-30 absolute w-full h-full top-0 left-0"></div>

        <div @click.self="closeModal" class="relative mx-auto max-w-4xl p-4 w-full h-full">
          <div class="relative bg-white overflow-scroll rounded border border-gray-100 w-full h-full">
            <div @click="closeModal" class="cursor-pointer fixed right-6 top-6 bg-white p-2 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor"
                   class="stroke-primary-600 hover:stroke-primary-700 transition duration:100 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>

            <div @click="goBackModal" v-if="modalStore.canGoBack"
                 class="cursor-pointer fixed right-20 top-6 bg-white p-2 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor"
                   class="stroke-primary-600 hover:stroke-primary-700 transition duration:100 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"/>
              </svg>
            </div>

            <LoadingModal v-if="modalStore.item.type === 'loading'" class="p-4"></LoadingModal>
            <BeerMatchComponent v-if="modalStore.item.type === 'beer'" class="p-4"
                                :beer="modalStore.item.beer"></BeerMatchComponent>
          </div>
        </div>
      </div>
    </transition>

    <div class="w-full my-4">
      <div class="text-sm text-gray-600 mb-2">{{ $t('generic.change_language') }}</div>

      <div class="flex flex-row gap-4">
        <RouterLink
            @click="handleLocaleChange(locale.locale)"
            v-for="locale of locales"
            :to="translateRoute(locale.locale)"
            class="rounded-full bg-white w-8 h-8 overflow-hidden"
        >
          <img
              :src="`https://flagcdn.com/${locale.flag}.svg`"
              alt="Flag of The Netherlands"
              class="w-full h-full object-cover"
          >
        </RouterLink>
      </div>

      <div class="mt-2 mb-4 text-gray-600 text-sm">
        {{ $t('generic.made_with_love') }} - <a href="https://arendz.nl" class="underline text-gray-800">Arendz.nl</a>
      </div>
    </div>
  </div>
</template>

<script>
import {useUserStore} from "@/stores/user";
import {useModalStore} from "@/stores/modal";
import BeerMatchComponent from "@/components/modals/BeerMatchComponent.vue";
import LoadingModal from "@/components/modals/LoadingModal.vue";
import LocalizedRouterLink from "@/components/LocalizedRouterLink.vue";
import {useMeta} from "vue-meta";
import {useI18n} from 'vue-i18n'

export default {
  components: {LocalizedRouterLink, LoadingModal, BeerMatchComponent},
  setup() {
    const userStore = useUserStore();
    const modalStore = useModalStore();
    const appVersion = userStore.version;

    const {t} = useI18n()
    useMeta({
      title: t('home.seo_title'),
      description: t('home.seo_description'),
      og: {
        title: t('home.seo_title'),
        description: t('home.seo_description')
      },
      htmlAttrs: {lang: 'nl', amp: false}
    })

    return {userStore, modalStore, appVersion}
  },
  computed: {
    showMenuLinks() {
      return this.userStore.importing === false && this.userStore.isLoggedIn && this.userStore.checkins.length !== 0;
    },
    showModal() {
      return this.modalStore.hasItems;
    },
    locales() {
      return [
        {
          flag: 'gb',
          locale: 'en'
        }, {
          flag: 'nl',
          locale: 'nl'
        }
      ];
    }
  },
  methods: {
    closeModal() {
      this.modalStore.close();
    },
    goBackModal() {
      this.modalStore.back();
    },
    translateRoute(locale) {
      if (this.$route.name) {
        const routeName = this.$route.name
            .replace('nl_', '')
            .replace('en_', '');

        return {name: locale + '_' + routeName};
      } else {
        return {name: 'nl_home'};
      }
    },
    handleLocaleChange(locale) {
      this.$i18n.locale = locale;
    }
  }
}
</script>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.15s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
