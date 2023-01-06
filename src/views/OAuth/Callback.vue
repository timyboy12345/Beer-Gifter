<script setup>
import {useCredentialsStore} from "../../stores/credentials";
import router from "@/router";

const credentialsStore = useCredentialsStore();

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

// Get the value of "code" in eg "https://example.com/?some_key=some_value"
let token = params.code; // "some_value"

credentialsStore.setToken(token);

router.push({'name': 'untappd-dashboard'});
</script>
