<template>
  <div class='box'>
    <section class='container'>
      <h1 class="title center">
        feline giveaways
      </h1>
      <p class='center'>an interface for password-protected discord giveaways</P>
      <div class='flex-row'>
        <nuxt-link class="flex-row-item button" to="/about">
          about
        </nuxt-link>
        <div class='flex-row-separator'></div>
        <nuxt-link class="flex-row-item button" to="/privacy">
          privacy
        </nuxt-link>
        <div class='flex-row-separator'></div>
        <nuxt-link v-if="!$store.state.user" class="flex-row-item button" to="/login">
          log in
        </nuxt-link>
        <a v-else class="flex-row-item button" @click.prevent="logout">
          log out
        </a>
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
