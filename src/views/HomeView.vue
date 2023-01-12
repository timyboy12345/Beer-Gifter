<template>
  <div>
    <div v-if="!userStore.isLoggedIn">
      <div class="my-20">
        <h1 class="text-5xl font-bold text-primary-800 text-center">Beer Gifter</h1>
        <p class="text-gray-600 text-sm mt-2 text-center">
          Vind het ideale biertje voor een goede vriend, op basis van hun Untappd-profiel
        </p>
      </div>

      <h2 class="text-lg text-primary-800">Hoe werkt Beer Gifter?</h2>
      <p class="text-sm text-gray-800">Weet je niet wat je moet kopen voor je bier-drinkende vriend? We kennen het
        probleem! Maar vrees niet, we hebben deze tool ontworpen voor precies dit doel. Voer een untappd-username in en
        zie welk biertjes deze persoon graag (en niet graag) drinkt. Zo is het net alsof je verstand hebt van bier en
        precies weet wat je moet kopen.</p>
    </div>

    <div v-else>
      <h1 class="text-2xl font-bold text-primary-800">Beer Gifter</h1>
      <p class="text-gray-800 text-sm mt-2">Weet je niet wat je moet kopen voor je bier-drinkende vriend? We kennen het
        probleem! Maar vrees niet, we hebben deze tool ontworpen voor precies dit doel. Voer een untappd-username in en
        zie welk biertjes deze persoon graag (en niet graag) drinkt. Zo is het net alsof je verstand hebt van bier en
        precies weet wat je moet kopen.</p>
    </div>

    <RouterLink v-if="!credentialsStore.isLoggedIn" to="/oauth/redirect"
                class="block mt-8 bg-primary-800 text-white py-2 px-4 rounded">
      Log in met Untappd
    </RouterLink>

    <Alert
        v-if="userStore.isLoggedIn && userStore.beers.length > 0"
        class="my-8"
        header="Er zijn al gegevens opgehaald"
    >
      <span class="text-gray-600 text-sm">
        Je kan maar van een paar mensen per uur gegevens ophalen. Je hebt de gegevens van {{ userStore.userName }} al opgehaald.
      </span>
      <RouterLink :to="{name: 'untappd-dashboard'}"
                  class="block underline text-primary-600 transition duration:100 hover:text-primary-700 text-sm">
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
        label="Zoek op gebruikersnaam"
        placeholder="Gebruikersnaam"
        :disabled="loading"
        :error="error"
        @submit="submit"
        @input.self="handleInput"
        @keyup.enter="submit()"
    />

    <div class="grid lg:grid-cols-2 gap-4 my-8">
      <div>
        <h2 class="text-lg text-primary-800">Hoe werkt Beer Gifter?</h2>
        <p class="text-sm text-gray-800">
          Nadat je zelf bent ingelogd met je Untappd-account (om misbruik te voorkomen) kan je een
          Untappd-gebruikersnaam invoeren. Je ziet dan in verschillende overzichten dingen die je misschien op weg
          kunnen helpen om het perfecte cadeau te geven, zoals favoriete locaties om bier te drinken, vaakst gedronken
          biertjes en meer. Maar het allerbelangrijkste: Zoeken op biernaam. Voer de naam van een willekeurig biertje in
          en bekijk of dit biertje past bij jou vriend/familielid/partner/....
        </p>
      </div>

      <div>
        <h2 class="text-lg text-primary-800">Is Beer Gifter waterdicht?</h2>
        <p class="text-sm text-gray-800">
          Nee! Zeker niet. We proberen je vooral op weg te helpen om een leuk biertje te vinden, of een heel bierpakket.
          Maar bier is complex, het ene biertje van type X is het andere biertje van type X niet. Dus vaar niet 100% op
          deze tool, maar probeer ook zelf logisch na te denken.
        </p>
      </div>

      <div>
        <h2 class="text-lg text-primary-800">Waarom moet ik inloggen met een Untappd-account?</h2>
        <p class="text-sm text-gray-800">
          Voornamelijk om misbruik te voorkomen. Helaas mogen we per uur maar 100x een vraag stellen aan de Untappd API,
          maar als je bent ingelogd geld deze 100x alleen voor jou, dus elke gebruiker op ons platform kan 100x per uur
          een biertje checken, informatie opvragen of gewoon kijken naar de statistieken.
        </p>
      </div>

      <div>
        <h2 class="text-lg text-primary-800">Wat als ik geen biertjes kan vinden?</h2>
        <p class="text-sm text-gray-800">
          Sta je in een bierspeciaalzaak? Top! De meeste medewerkers van zo'n winkel weten heel veel van bier en kunnen
          je vast helpen. Vertel wat je zoekt, vraag of ze je kunnen helpen op basis van een Untappd-profiel of vraag of
          ze goede tips hebben om het perfecte biertje te vinden. Sta je in de supermarkt? Dan wensen we je vooral veel
          succes! Vaak hebben de mensen die hier werken niet heel veel verstand van bier, maar het is een poging waard
          iemand te vragen.
        </p>
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
