import { createApp } from 'vue'

import App from './App.vue'

import './assets/main.css'

import axios from 'axios'
import VueAxios from 'vue-axios'

const app = createApp(App)

import { createPinia } from 'pinia'
app.use(createPinia())

import router from './router'
app.use(router)

app.use(VueAxios, axios);
app.provide('axios', app.config.globalProperties.axios) // provide 'axios'

// @ts-ignore
import untappdPlugin from './plugins/untappdPlugin.js';
app.use(untappdPlugin);

// @ts-ignore
import beerPopup from './plugins/beerPopup.js';
app.use(beerPopup);

import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";

// @ts-ignore
if (typeof process === 'object' && process.env.ENVIRONMENT === 'production') {
    Sentry.init({
        app,
        dsn: "https://993f8dfc7abe4851b257b94d7dd468aa@o324258.ingest.sentry.io/4504469531197440",
        integrations: [
            new BrowserTracing({
                routingInstrumentation: Sentry.vueRouterInstrumentation(router),
                tracePropagationTargets: ["localhost", "my-site-url.com", /^\//],
            }),
        ],
        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
        logErrors: true
    });
}

import i18n from "@/i18n";
app.use(i18n)

import { createMetaManager } from 'vue-meta'
app.use(createMetaManager())

app.mount('#app')
