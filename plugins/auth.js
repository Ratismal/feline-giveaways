export default async ({ req, store, app }) => {
    let token = localStorage.getItem('token');
    console.log('token', token);
    if (token !== null) {
        const user = await app.$axios.$get("/users/@me", {
            headers: {
                Authorization: token
            }
        });
        store.commit("setUser", user);
        app.$axios.setToken(token);
    }
};