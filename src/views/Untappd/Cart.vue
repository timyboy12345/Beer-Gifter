<template>
  <div>
    <h1 class="text-3xl font-bold text-primary-900">{{ $t('untappd_cart.header') }}</h1>
    <h2 class="text-sm text-gray-600">{{ $t('untappd_cart.subheader', {count: userStore.cart.length}) }}</h2>

    <BeerList
        v-if="userStore.cart.length > 0"
        :beers="userStore.cart"
        class="mt-4 mb-8"
    ></BeerList>

    <Alert
        v-else
        :content="$t('untappd_cart.no_beers_added_content')"
        :header="$t('untappd_cart.no_beers_added_header')"
        class="mt-4 mb-8"
    ></Alert>
  </div>
</template>
<script>
import BeerList from "@/components/lists/BeerList.vue";
import {useUserStore} from "@/stores/user";
import Alert from "@/components/Alert.vue";
import {useI18n} from "vue-i18n";
import {useMeta} from "vue-meta";

export default {
  components: {Alert, BeerList},
  setup() {
    const userStore = useUserStore();

    const {t} = useI18n()
    useMeta({
      title: t('untappd_cart.seo_title'),
      description: t('untappd_cart.seo_description'),
      og: {
        title: t('untappd_cart.seo_title'),
        description: t('untappd_cart.seo_description')
      },
      htmlAttrs: {lang: 'nl', amp: false}
    })

    return {userStore};
  }
}
</script>
