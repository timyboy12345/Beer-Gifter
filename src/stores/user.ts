import {defineStore} from 'pinia'
import {version} from '../../package.json';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        userName: null,
        importing: false,
        checkins: [],
        beers: [],
        venues: [],
        breweries: [],
        version: version,
    }),
    actions: {
        setUser(user: any) {
            localStorage.setItem('user', JSON.stringify(user));
            this.user = user;
        },
        setUserName(userName: string) {
            localStorage.setItem('userName', userName);
            // @ts-ignore
            this.userName = userName;
        },
        setImporting(importing: boolean) {
            this.importing = importing;
        },
        addCheckin(checkin: any) {
            // @ts-ignore
            this.checkins.push(checkin)
        },
        addCheckins(checkins: any[]) {
            // @ts-ignore
            this.checkins = this.checkins.concat(checkins)

            const c = localStorage.getItem('checkins');
            const j: any[] = c ? JSON.parse(c) : [];
            const n = j.concat(checkins);
            localStorage.setItem('checkins', JSON.stringify(n));
        },
        resetCheckins() {
            this.checkins = [];

            localStorage.removeItem('user');
            localStorage.removeItem('userName');
            localStorage.removeItem('checkins');
        },
        hasCachedResults() {
            return localStorage.getItem('user')
                && localStorage.getItem('userName')
                && localStorage.getItem('checkins');
        },
        restoreCachedResults() {
            // @ts-ignore
            this.setUser(JSON.parse(localStorage.getItem('user')));
            // @ts-ignore
            this.setUserName(localStorage.getItem('userName'));

            // @ts-ignore
            this.checkins = JSON.parse(localStorage.getItem('checkins'));

            this.recalculate();
        },
        resetAll() {
            localStorage.removeItem('user');
            localStorage.removeItem('userName');
            localStorage.removeItem('checkins');

            this.breweries = [];
            this.venues = [];
            this.beers = [];
            this.checkins = [];
            this.userName = null;
            this.user = null;
        },
        recalculate() {
            return new Promise(resolve => {
                // @ts-ignore
                this.beers = [...new Map(this.checkins.map(item => [item.beer.bid, {
                    // @ts-ignore
                    ...item.beer,
                    // @ts-ignore
                    brewery: item.brewery
                }])).values()];

                // @ts-ignore
                this.venues = [...new Map(this.checkins.map(item => [item.venue.venue_id, item.venue])).values()]
                    // Filter out checkins without venue
                    .filter((v) => !Array.isArray(v));

                // @ts-ignore
                const breweries = this.beers
                    .filter((b: any) => b.brewery)
                    .map((b: any) => b.brewery);

                // @ts-ignore
                this.breweries = [...new Map(breweries.map(item => [item.brewery_name, item])).values()];

                this.beers.map((beer: any) => {
                    beer.count = this.checkins.filter((ci: any) => ci.beer.bid === beer.bid).length;
                })

                this.venues.map((venue: any) => {
                    venue.count = this.checkins.filter((ci: any) => ci.venue.venue_id === venue.venue_id).length;
                })

                this.breweries.map((brewery: any) => {
                    brewery.count = this.checkins.filter((ci: any) => ci.brewery.brewery_id === brewery.brewery_id).length;
                })

                resolve(true);
            });
        }
    },
    getters: {
        // @ts-ignore
        fullName: (state) => state.user ? `${state.user.first_name} ${state.user.last_name}` : null,
        isLoggedIn: (state) => Boolean(state.user),
    }
})
