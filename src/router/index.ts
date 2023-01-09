import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import {useUserStore} from "@/stores/user";

function hasValidUntappdCredentials(to: any) {
    const userStore = useUserStore();

    if (!userStore.isLoggedIn) {
        if (userStore.hasCachedResults()) {
            userStore.restoreCachedResults();
            return to;
        } else {
            return {name: 'home'}
        }
    }
}

function restoreData() {
    const userStore = useUserStore();

    try {
        if (!userStore.isLoggedIn && userStore.checkins.length === 0) {
            if (userStore.hasCachedResults()) {
                userStore.restoreCachedResults();
            }
        }
    } catch (err) {
        console.error(err);
        window.alert('Error while trying to retrieve results from localstorage');
    }
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/home',
            name: 'home',
            component: HomeView,
            beforeEnter: [restoreData]
        },
        {
            path: '/untappd/loading',
            name: 'untappd-loading',
            component: () => import('@/views/Untappd/LoadingView.vue'),
            beforeEnter: [hasValidUntappdCredentials]
        },
        {
            path: '/untappd/dashboard',
            name: 'untappd-dashboard',
            component: () => import('@/views/Untappd/UntappdView.vue'),
            beforeEnter: [hasValidUntappdCredentials]
        },
        {
            path: '/untappd/beers',
            name: 'untappd-beers',
            component: () => import('@/views/Untappd/BeersView.vue'),
            beforeEnter: [hasValidUntappdCredentials]
        },
        {
            path: '/untappd/venues',
            name: 'untappd-venues',
            component: () => import('@/views/Untappd/VenuesView.vue'),
            beforeEnter: [hasValidUntappdCredentials]
        },
        {
            path: '/untappd/checkins',
            name: 'untappd-checkins',
            component: () => import('@/views/Untappd/CheckinsView.vue'),
            beforeEnter: [hasValidUntappdCredentials]
        },
        {
            path: '/untappd/beer-matcher',
            name: 'untappd-beermatcher-index',
            component: () => import('@/views/Untappd/BeerMatcher/BeerMatcher.vue'),
            beforeEnter: [hasValidUntappdCredentials]
        },
        {
            path: '/untappd/beer-matcher/:id',
            name: 'untappd-beermatcher-show',
            component: () => import('@/views/Untappd/BeerMatcher/BeerMatcherResult.vue'),
            beforeEnter: [hasValidUntappdCredentials]
        },
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
            redirect: '/home',
        }
    ]
})

export default router
