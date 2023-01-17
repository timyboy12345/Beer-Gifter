import {createRouter, createWebHistory} from 'vue-router'
import {useUserStore} from "@/stores/user";

function hasValidUntappdCredentials() {
    const userStore = useUserStore();

    if (!userStore.isLoggedIn) {
        return {name: 'nl_home'}
    }
}

const routes = [
    {
        name: 'home',
        path: 'home',
        component: () => import('@/views/HomeView.vue'),
        beforeEnter: []
    },
    {
        path: 'untappd/loading',
        name: 'untappd-loading',
        component: () => import('@/views/Untappd/LoadingView.vue'),
        beforeEnter: [hasValidUntappdCredentials]
    },
    {
        path: 'untappd/dashboard',
        name: 'untappd-dashboard',
        component: () => import('@/views/Untappd/UntappdView.vue'),
        beforeEnter: [hasValidUntappdCredentials]
    },
    {
        path: 'untappd/beers',
        name: 'untappd-beers',
        component: () => import('@/views/Untappd/BeersView.vue'),
        beforeEnter: [hasValidUntappdCredentials]
    },
    {
        path: 'untappd/venues',
        name: 'untappd-venues',
        component: () => import('@/views/Untappd/VenuesView.vue'),
        beforeEnter: [hasValidUntappdCredentials]
    },
    {
        path: 'untappd/checkins',
        name: 'untappd-checkins',
        component: () => import('@/views/Untappd/CheckinsView.vue'),
        beforeEnter: [hasValidUntappdCredentials]
    },
    {
        path: 'untappd/cart',
        name: 'untappd-cart',
        component: () => import('@/views/Untappd/Cart.vue'),
        beforeEnter: [hasValidUntappdCredentials]
    },
    {
        path: 'untappd/beer-matcher',
        name: 'untappd-beermatcher-index',
        component: () => import('@/views/Untappd/BeerMatcher/BeerMatcher.vue'),
        beforeEnter: [hasValidUntappdCredentials]
    },
    {
        path: 'untappd/beer-matcher/:id',
        name: 'untappd-beermatcher-show',
        component: () => import('@/views/Untappd/BeerMatcher/BeerMatcherResult.vue'),
        beforeEnter: [hasValidUntappdCredentials]
    }
];


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // EN
        ...routes.map((route) => ({
            path: '/en/' + route.path,
            name: 'en_' + route.name,
            nonTranslatedName: route.name,
            component: route.component,
            beforeEnter: [reset, ...route.beforeEnter]
        })),

        // nl
        ...routes.map((route) => ({
            path: '/nl/' + route.path,
            name: 'nl_' + route.name,
            nonTranslatedName: route.name,
            component: route.component,
            beforeEnter: [reset, ...route.beforeEnter]
        })),

        // No Locale
        ...routes.map((route) => ({
            path: '/' + route.path,
            redirect: {
                name: 'nl_' + route.name
            },
            name: route.name
        })),

        {
            path: '/oauth/redirect',
            name: 'oauth-redirect',
            component: () => import('@/views/OAuth/Redirect.vue'),
        },
        {
            path: '/oauth/callback',
            name: 'oauth-callback',
            component: () => import('@/views/OAuth/Callback.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            redirect: '/nl/home',
        }
    ]
})

async function reset() {
    const userStore = useUserStore();

    if (userStore.checkins.length > 0 && userStore.beers.length === 0) {
        await userStore.recalculate();
    }
}

export default router
