<template>
  <div>
    <h1 class="text-2xl font-bold text-yellow-800">Beer Gifter</h1>
    <p class="text-gray-800">Don't know what to buy for your beer-loving friends? We know the struggle! Don't worry,
      with this tool, you can just enter their Untappd profile-name, and off you go finding the perfect beer to buy.</p>

    <RouterLink v-if="!credentialsStore.isLoggedIn" to="/oauth/redirect"
                class="block mt-8 bg-yellow-800 text-white py-2 px-4 rounded">
      Log in met Untappd
    </RouterLink>

    <Alert
        v-if="userStore.isLoggedIn && userStore.beers.length > 0"
        class="my-8"
        header="Er zijn al gegevens opgehaald"
    >
      <span class="text-gray-600 text-sm">
        Je kan maar van een 5 mensen per uur gegevens ophalen. Je hebt de gegevens van {{ userStore.userName }} al opgehaald.
      </span>
      <RouterLink :to="{name: 'untappd-dashboard'}" class="block underline text-yellow-600 text-sm">
        Bekijk alle gegevens van {{ userStore.userName }}
      </RouterLink>
    </Alert>

    <div class="mt-8 flex flex-col" v-if="credentialsStore.isLoggedIn">
      <label for="name">Search by username</label>
      <input id="name"
             autofocus
             v-model="nameInput"
             :disabled="loading"
             :class="{'opacity-50': loading}"
             class="focus:ring-2 ring-yellow-500 outline-none border-yellow-800 border-opacity-10 border-2 rounded py-2 px-4"
             @keyup.enter="submit"
      >

      <div class="text-red-800 text-italic text-sm mt-2" v-if="error">
        {{ error }}
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

export default {
  data() {
    return {
      nameInput: '',
      loading: false,
      error: null
    }
  },
  components: {Alert},
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
            this.userStore.setUser(user);
            this.userStore.setUserName(this.nameInput);
            this.userStore.resetCheckins();

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
    }
  }
}
</script>
