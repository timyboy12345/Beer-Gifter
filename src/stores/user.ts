import {defineStore} from 'pinia'
import {version} from '../../package.json';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        userName: null,
        importing: false,
        cart: [],
        checkins: [],
        beers: [],
        venues: [],
        breweries: [],
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
        setImporting(importing: boolean) {
            this.importing = importing;
        },
        addCheckin(checkin: any) {
            // @ts-ignore
            this.checkins.push(checkin)
        },
        addToCart(beer: object) {
            // @ts-ignore
            this.cart.push(beer);
        },
        removeFromCart(beer: object) {
            // @ts-ignore
            const b = this.cart.find((cartBeer) => cartBeer.bid === beer.bid);
            // @ts-ignore
            const i = this.cart.indexOf(b);

            this.cart.splice(i, 1);
        },
        cartIncludes(beer: object){
            // @ts-ignore
            return this.cart.find((cartBeer) => cartBeer.bid === beer.bid) !== undefined;
        },
        addCheckins(checkins: any[]) {
            // @ts-ignore
            this.checkins = this.checkins.concat(checkins)
        },
        resetCheckins() {
            this.checkins = [];
        },
        resetAll() {
            this.breweries = [];
            this.venues = [];
            this.beers = [];
            this.cart = [];
            this.checkins = [];
            this.userName = null;
            this.user = null;
        },
        recalculate() {
            return new Promise(resolve => {
                const beersWithBrewery = this.checkins
                    .map((checkin) => {
                        return {
                            // @ts-ignore
                            ...checkin.beer,
                            // @ts-ignore
                            brewery: checkin.brewery
                        }
                    });

                const beers = {};
                for (const b of beersWithBrewery) {
                    // @ts-ignore
                    if (!(b.bid in beers)) {
                        const firstCheckin = this.checkins.filter((ci: any) => ci.beer.bid === b.bid);
                        // @ts-ignore
                        const score = firstCheckin.length > 0 ? firstCheckin[0].rating_score : null;

                        // @ts-ignore
                        beers[b.bid] = {
                            ...b,
                            // @ts-ignore
                            count: this.checkins.filter((ci: any) => ci.beer.bid === b.bid).length,
                            // @ts-ignore
                            score: score
                        };
                    }
                }

                // @ts-ignore
                this.beers = Object.values(beers);

                const venues = {};
                for (const checkin of this.checkins) {
                    // @ts-ignore
                    if (!(checkin.venue.venue_id in venues) && checkin.venue.location) {
                        // @ts-ignore
                        venues[checkin.venue.venue_id] = {
                            // @ts-ignore
                            ...checkin.venue,
                            // @ts-ignore
                            count: this.checkins.filter((ci: any) => ci.venue.venue_id === checkin.venue.venue_id).length
                        }
                    }
                }

                // @ts-ignore
                this.venues = Object.values(venues);

                const breweries = {};
                // @ts-ignore
                for (const beer of beersWithBrewery) {
                    if (!(beer.brewery.brewery_id in breweries)) {
                        // @ts-ignore
                        breweries[beer.brewery.brewery_id] = {
                            ...beer.brewery,
                            count: beersWithBrewery.filter((bwb: any) => bwb.brewery.brewery_id === beer.brewery.brewery_id).length
                        }
                    }
                }

                // @ts-ignore
                this.breweries = Object.values(breweries);

                resolve(true);
            });
        }
    },
    getters: {
        // @ts-ignore
        fullName: (state) => state.user ? `${state.user.first_name} ${state.user.last_name}` : null,
        isLoggedIn: (state) => Boolean(state.user),
    },
    persist: {
        enabled: true,
        strategies: [{
            storage: localStorage,
            paths: ['checkins', 'cart', 'user', 'userName']
        }]
    }
})
