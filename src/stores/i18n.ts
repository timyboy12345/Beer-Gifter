import { defineStore } from 'pinia'

export const useI18nStore = defineStore('i18n',  {
    state: () => ({
        locale: localStorage.getItem('i18n_locale'),
    }),
    actions: {
        setLocale(locale: string) {
            localStorage.setItem('i18n_locale', locale);
            // @ts-ignore
            this.locale = locale;

            // TODO: Fix this
            // @ts-ignore
            // i18n.locale = 'en';
        }
    }
})
