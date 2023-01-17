<template>
  <div>
    <h1 class="text-3xl font-bold text-primary-900">{{ $t('untappd_checkins.header') }}</h1>
    <h2 class="text-sm text-gray-600">{{ $t('untappd_checkins.subheader', {count: userStore.checkins.length}) }}</h2>

    <CheckinList :checkins="userStore.checkins" class="mt-4 mb-8"></CheckinList>
  </div>
</template>

<script>
import {useUserStore} from "@/stores/user";
import CheckinList from "@/components/lists/CheckinList.vue";
import {useI18n} from "vue-i18n";
import {useMeta} from "vue-meta";

export default {
  components: {CheckinList},
  setup() {
    const userStore = useUserStore();

    const {t} = useI18n()
    useMeta({
      title: t('untappd_checkins.seo_title'),
      description: t('untappd_checkins.seo_description'),
      og: {
        title: t('untappd_checkins.seo_title'),
        description: t('untappd_checkins.seo_description')
      },
      htmlAttrs: {lang: 'nl', amp: false}
    })

    return {userStore}
  }
}
</script>
