<script setup lang="ts">
import {inject, ref} from 'vue';
import {useUserStore} from "@/stores/user";
import {useCredentialsStore} from "@/stores/credentials";
import router from "@/router";

const userStore = useUserStore();
const credentialsStore = useCredentialsStore();

const nameInput = ref(null);
const getUntappdUser: any = inject('getUntappdUserInfo');

let loading = ref(false);

function submit() {
  loading.value = true;

  const user = getUntappdUser(nameInput.value)
      .then((user: any) => {
        userStore.setUser(user);
        // @ts-ignore
        userStore.setUserName(nameInput.value);
        userStore.resetCheckins();

        router.push({name: "untappd-loading"});
      })
      // @ts-ignore
      .catch((err) => {
        console.error(err);
      })
      .then(() => {
        loading.value = false;
      })
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-yellow-800">Beer Gifter</h1>
    <p class="text-gray-800">Don't know what to buy for your beer-loving friends? We know the struggle! Don't worry,
      with this tool, you can just enter their Untappd profile-name, and off you go finding the perfect beer to buy.</p>

    <RouterLink v-if="!credentialsStore.isLoggedIn" to="/oauth/redirect" class="block mt-8 bg-yellow-800 text-white py-2 px-4 rounded">
      Log in met Untappd
    </RouterLink>

    <div class="mt-8" v-if="userStore.isLoggedIn">
      Currently viewing info of {{ userStore.userName }}

      <RouterLink :to="{name: 'untappd-dashboard'}" class="block underline text-yellow-600">
        Bekijk alle gegevens van {{ userStore.userName }}
      </RouterLink>
    </div>

    <div class="mt-8 flex flex-col" v-if="credentialsStore.isLoggedIn">
      <label for="name">Search by username</label>
      <input id="name"
             v-model="nameInput"
             :disabled="loading"
             :class="{'opacity-50': loading}"
             class="focus:ring-2 ring-yellow-500 outline-none border-yellow-800 border-opacity-10 border-2 rounded py-2 px-4"
             @keyup.enter="submit"
      >
    </div>
  </div>
</template>
