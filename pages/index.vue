<template>
  <div class='box'>
    <section class='container'>
      <h1 class="title center">
        Feline Giveaways
      </h1>
      <p class='center'>An interface for password-protected discord giveaways</p>
      <div class='flex-row'>
        <nuxt-link class="flex-row-item" to="/about">
          About
        </nuxt-link>
        <div class='flex-row-separator'></div>
        <nuxt-link class="flex-row-item" to="/privacy">
          Privacy
        </nuxt-link>
        <div class='flex-row-separator'></div>
        <nuxt-link v-if="!$store.state.user" class="flex-row-item" to="/login">
          Log In
        </nuxt-link>
        <a v-else class="flex-row-item" @click.prevent="logout">
          Log Out
        </a>
      </div>
      <div v-if="$store.state.user" class='button-bar'>
        <nuxt-link class='button' to="/create">
          create a giveaway
        </nuxt-link>
        <nuxt-link class='button' to="/manage">
          manage giveaways
        </nuxt-link>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  mounted() {},
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$store.commit("setUser", null);
    }
  }
};
</script>


<style scoped>
</style>
