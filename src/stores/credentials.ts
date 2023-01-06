import { defineStore } from 'pinia'

export const useCredentialsStore = defineStore('credentials',  {
    state: () => ({
        token: sessionStorage.getItem('token')
    }),
    actions: {
        setToken(token: string) {
            sessionStorage.setItem('token', token);
            // @ts-ignore
            this.token = token;
        },
        logout() {
            sessionStorage.removeItem('token');
            this.token = null;
        }
    },
    getters: {
        isLoggedIn: (state) => {
            return state.token !== null;
        }
    }
})
