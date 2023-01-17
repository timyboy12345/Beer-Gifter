<template>
  <div>
    <div v-if="!userStore.isLoggedIn">
      <div class="my-20">
        <h1 class="text-5xl font-bold text-primary-800 text-center">{{ $t('home.title') }}</h1>
        <p class="text-gray-600 text-sm mt-2 text-center">{{ $t('home.subTitle') }}</p>
      </div>

      <h2 class="text-lg text-primary-800">{{ $t('home.notloggedin_title') }}</h2>
      <p class="text-sm text-gray-800">{{ $t('home.notloggedin_content') }}</p>
    </div>

    <div v-else>
      <h1 class="text-2xl font-bold text-primary-800">{{ $t('home.loggedin_title') }}</h1>
      <p class="text-gray-800 text-sm mt-2">{{ $t('home.loggedin_content') }}</p>
    </div>

    <RouterLink v-if="!credentialsStore.isLoggedIn" to="/oauth/redirect"
                class="block mt-8 bg-primary-800 text-white py-2 px-4 rounded">
      {{ $t('home.login_using_untappd') }}
    </RouterLink>

    <Alert
        v-if="userStore.isLoggedIn && userStore.beers.length > 0"
        class="my-8"
        :header="$t('home.limitation_warning_title')"
    >
      <span class="text-gray-600 text-sm">{{ $t('home.limitation_warning_content', {name: userStore.userName})}}</span>
      <RouterLink :to="{name: 'untappd-dashboard'}"
                  class="block underline text-primary-600 transition duration:100 hover:text-primary-700 text-sm">
        {{ $t('home.limitation_warning_proceed', {name: userStore.userName}) }}
      </RouterLink>

      <div class="text-red-800 mt-4 text-sm cursor-pointer hover:underline hover:text-red-900 transition duration:100"
           @click="resetAll">
        {{ $t("home.limitation_warning_delete") }}
      </div>
    </Alert>

    <FormInput
        :value="nameInput"
        v-if="credentialsStore.isLoggedIn"
        class="my-8"
        :label="$t('home.search_by_username')"
        :placeholder="$t('generic.username')"
        :disabled="loading"
        :error="error"
        @submit="submit"
        @input.self="handleInput"
        @keyup.enter="submit()"
    />

    <div class="grid lg:grid-cols-2 gap-4 my-8">
      <div>
        <h2 class="text-lg text-primary-800">{{ $t('home.sub1_title') }}</h2>
        <p class="text-sm text-gray-800">{{ $t('home.sub1_content') }}</p>
      </div>

      <div>
        <h2 class="text-lg text-primary-800">{{ $t('home.sub2_title') }}</h2>
        <p class="text-sm text-gray-800">{{ $t('home.sub2_content') }}</p>
      </div>

      <div>
        <h2 class="text-lg text-primary-800">{{ $t('home.sub3_title') }}</h2>
        <p class="text-sm text-gray-800">{{ $t('home.sub3_content') }}</p>
      </div>

      <div>
        <h2 class="text-lg text-primary-800">{{ $t('home.sub4_title') }}</h2>
        <p class="text-sm text-gray-800">{{ $t('home.sub4_content') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import {inject} from 'vue';
import {useUserStore} from "@/stores/user";
import {useCredentialsStore} from "@/stores/credentials";
import router from "@/router";
import Alert from '@/components/Alert.vue';
import FormInput from '@/components/FormInput.vue';

export default {
  data() {
    return {
      nameInput: '',
      loading: false,
      error: null
    }
  },
  components: {Alert, FormInput},
  setup() {
    const userStore = useUserStore();
    const credentialsStore = useCredentialsStore();
    const getUntappdUser = inject('getUntappdUserInfo');

    return {userStore, credentialsStore, getUntappdUser};
  },
  methods: {
    submit() {
      this.loading = true;
      this.error = null;

      this.getUntappdUser(this.nameInput)
          .then((user) => {
            this.userStore.resetCheckins();
            this.userStore.setUser(user);
            this.userStore.setUserName(this.nameInput);

            router.push({name: "untappd-loading"});
          })
          .catch((err) => {
            if (err.meta && err.meta.code === 404 && err.meta.error_detail) {
              this.error = err.meta.error_detail;
            } else {
              throw err;
            }
          })
          .then(() => {
            this.loading = false;
          })
    },
    resetAll() {
      this.userStore.resetAll();
    },
    handleInput(e) {
      this.nameInput = e;
    }
  }
}
</script>
