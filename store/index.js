export const state = () => ({
    user: null,
    token: null
});

export const mutations = {
    setUser(state, user) {
        state.user = user;
    },
    setUserPrivacy(state, accept) {
        state.user.privacyAccept = accept;
    },
    setToken(state, token) {
        state.token = token;
    }
};

export const actions = {
    async nuxtServerInit({ commit }, { app, req, store }) {
    }
};
