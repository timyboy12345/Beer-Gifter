import { defineStore } from 'pinia'

export const useCredentialsStore = defineStore('credentials',  {
    state: () => ({
        token: localStorage.getItem('token')
    }),
    actions: {
        setToken(token: string) {
            localStorage.setItem('token', token);
            // @ts-ignore
            this.token = token;
        },
        logout() {
            localStorage.removeItem('token');
            this.token = null;
        }
    },
    getters: {
        isLoggedIn: (state) => {
            return state.token !== null;
        }
    }
})
