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
      <RouterLink :to="{name: 'untappd-dashboard'}" class="block underline text-yellow-600 transition duration:100 hover:text-yellow-700 text-sm">
        Bekijk alle gegevens van {{ userStore.userName }}
      </RouterLink>

      <div class="text-red-800 mt-4 text-sm cursor-pointer hover:underline hover:text-red-900 transition duration:100"
           @click="resetAll">
        Of verwijder alle lokale gegevens.
      </div>
    </Alert>

    <FormInput
        :value="nameInput"
        v-if="credentialsStore.isLoggedIn"
        class="my-8"
        label="Search by username"
        :disabled="loading"
        :error="error"
        @submit="submit"
        @input.self="handleInput"
        @keyup.enter="submit()"
    />
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
