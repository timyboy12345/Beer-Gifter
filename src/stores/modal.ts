import {defineStore} from 'pinia'

export const useModalStore = defineStore('modal', {
    state: () => ({
        items: []
    }),
    actions: {
        showLoadingModal() {
            this.items.push({
                // @ts-ignore
                type: 'loading'
            });
        },
        showBeerModal(beer: object) {
            // @ts-ignore
            if (this.hasItems && this.item.type === 'loading') {
                this.items.pop();
            }

            // @ts-ignore
            this.items.push({
                // @ts-ignore
                type: 'beer',
                // @ts-ignore
                beer: beer
            });
        },
        back() {
            this.items.pop();
        },
        close() {
            this.items = [];
        },
    },
    getters: {
        hasItems: (state) => {
            return state.items.length > 0;
        },
        item: (state) => {
            return state.items[state.items.length - 1];
        },
        canGoBack: (state) => {
            // @ts-ignore
            return state.items.length >= 2 && state.items[state.items.length - 1].type !== 'loading';
        }
    }
})
