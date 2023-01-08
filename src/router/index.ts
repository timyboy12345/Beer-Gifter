import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useUserStore } from "@/stores/user";

function hasValidUntappdCredentials() {
  const userStore = useUserStore();
  if (!userStore.isLoggedIn) {
    return { name: 'home' }
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView
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
