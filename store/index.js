export const state = () => ({
    user: null,
    token: null,
    privacyVersion: 0
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
    },
    setPrivacyVersion(state, ver) {
        state.privacyVersion = ver;
    }
};

export const actions = {
    async nuxtServerInit({ commit }, { app, req, store }) {
    }
};
