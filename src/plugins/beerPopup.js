import {useModalStore} from "@/stores/modal";

export default {
    install: (app, options) => {
        const modalStore = useModalStore();

        const showLoadingModal = () => {
            modalStore.showLoadingModal();
        }

        const showBeerModal = (beer) => {
            modalStore.showBeerModal(beer);
        }

        app.provide('showLoadingModal', showLoadingModal);
        app.provide('showBeerModal', showBeerModal);
    }
}
