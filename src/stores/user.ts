import { defineStore } from 'pinia'
import { version } from '../../package.json';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        userName: null,
        checkins: [],
        version: version,
    }),
    actions: {
        setUser(user: any) {
            this.user = user;
        },
        setUserName(userName: string) {
            // @ts-ignore
            this.userName = userName;
        },
        addCheckin(checkin: any) {
            // @ts-ignore
            this.checkins.push(checkin)
        },
        addCheckins(checkins: any[]) {
            // @ts-ignore
            this.checkins = this.checkins.concat(checkins)
        },
        resetCheckins() {
            this.checkins = [];
        }
    },
    getters: {
        // @ts-ignore
        fullName: (state) => state.user ? `${state.user.first_name} ${state.user.last_name}` : null,
        isLoggedIn: (state) => Boolean(state.user),
        // @ts-ignore
        beers: (state) => [...new Map(state.checkins.map(item => [item.beer.bid, item.beer])).values()],
        // @ts-ignore
        venues: (state) => [...new Map(state.checkins.map(item => [item.venue.venue_id, item.venue])).values()].filter((v) => !Array.isArray(v))
    }
})
