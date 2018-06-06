<template>
  <div class='box'>
    <section class='container'>
      <h1 class='title center'>
        logging in...
      </h1>
    </section>
  </div>
</template>
<script>
export default {
  data() {
    return {
      redirect_uri: window.location.origin + window.location.pathname
    };
  },
  mounted() {
    if (!this.$route.query.code) {
      if (this.$store.state.user) this.$router.replace("/");
      else
        window.location.href =
          "https://discordapp.com/oauth2/authorize" +
          "?client_id=453716817639243779" +
          "&scope=identify" +
          "&response_type=code" +
          "&redirect_uri=" +
          encodeURIComponent(this.redirect_uri);
    } else {
      this.login();
    }
  },
  methods: {
    async login() {
      const { token } = await this.$axios.$post("/login", {
        code: this.$route.query.code,
        redirect_uri: this.redirect_uri
      });
      const user = await this.$axios.$get("/users/@me", {
        headers: {
          Authorization: token
        }
      });
      localStorage.setItem("token", token);
      this.$axios.setHeader("Authorization", token);
      this.$store.commit("setUser", user);

      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
</style>
