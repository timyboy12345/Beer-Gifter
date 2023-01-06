import {useCredentialsStore} from "@/stores/credentials";

export default {
    install: (app, options) => {
        const credentialsStore = useCredentialsStore();

        const getUntappdUserCheckins = (userName, maxId) => {
            return new Promise((resolve, reject) => {
                app.axios.get(`https://api.untappd.com/v4/user/checkins/${userName}?access_token=${credentialsStore.token}&max_id=${maxId}&limit=50`)
                    .then((response) => {
                        resolve(response.data.response);
                    })
                    .catch((err) => {
                        reject(err);
                    })
            });
        }

        const getUntappdUserInfo = (userName) => {
            return new Promise((resolve, reject) => {
                app.axios.get(`https://api.untappd.com/v4/user/info/${userName}?access_token=${credentialsStore.token}`)
                    .then((response) => {
                        resolve(response.data.response.user);
                    })
                    .catch((err) => {
                        reject(err);
                    })
            });
        }

        app.provide('getUntappdUserCheckins', getUntappdUserCheckins);
        app.provide('getUntappdUserInfo', getUntappdUserInfo);
    }
}
