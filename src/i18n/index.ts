import { createI18n } from 'vue-i18n'

// @ts-ignore
import en from './locales/en.json';
import nl from './locales/nl.json'

const i18n = createI18n<true>({
    legacy: false,
    locale: getLocale(),
    messages: {
        en,
        nl
    }
})

function getLocale() {
    if (document.URL.includes('/nl/')) {
        return 'nl';
    }

    if (document.URL.includes('/en/')) {
        return 'en';
    }

    return 'nl';
}

export default i18n
