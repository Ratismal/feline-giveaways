<template>
  <div class='box'>
    <section class='container'>
      <h1 class='title center'>
        Logging In...
      </h1>
      <div class='flex-row'>
        <a class="flex-row-item" @click.prevent="$router.go(-1);">
          Back
        </a>
      </div>
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
    if (this.$store.state.user) {
      return this.redirect(this.$store.state.user);
    } else if (!this.$route.query.code) {
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
      this.redirect(user);
    },
    redirect(user) {
      if (!user.privacyAccept) {
        this.$router.push("/privacy");
      } else {
        if (localStorage.returnTo) {
          this.$router.push(localStorage.returnTo);
          localStorage.removeItem("returnTo");
        } else this.$router.push("/");
      }
    }
  }
};
</script>

<style scoped>
</style>
