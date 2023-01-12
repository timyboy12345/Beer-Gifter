<template>
  <div>
    <h1 class="text-3xl font-bold text-primary-900">Alle Checkins</h1>
    <h2 class="text-sm text-gray-600">{{ userStore.checkins.length }} checkins</h2>

    <CheckinList :checkins="userStore.checkins" class="mt-4 mb-8"></CheckinList>
  </div>
</template>

<script>
import {useUserStore} from "@/stores/user";
import CheckinList from "@/components/lists/CheckinList.vue";

export default {
  components: {CheckinList},
  setup() {
    const userStore = useUserStore();
    return {userStore}
  }
}
</script>
