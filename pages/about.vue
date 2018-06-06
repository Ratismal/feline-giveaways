<template>
  <div class='box'>
    <section class='container'>
      <h1 class="title center">
        about
      </h1>
      <p class='center'>Giveaways can be great for stimulating activity within your guild. However, common implementations are usually mindless; click a button, wait for somebody to get picked.</P>
      <p class='center'>The objective of this site is to make giveaways more engaging.</p>
      <p class='center'>In order to register for a giveaway, a password is required. You can set this password to whatever you like, and give it out in your guild however you like.</p>
      <p class='center'>Make a puzzle. Hide it in a message.</p>
      <p class='center'>Be creative.</p>
      <p class='center'>&copy; stupid cat | 2018</p>
      <div class='flex-row'>
        <nuxt-link class="flex-row-item" to="/">
          Back
        </nuxt-link>
        <div class='flex-row-separator'></div>
        <a class='flex-row-item' href='https://github.com/ratismal/feline-giveaways'>Source</a>
      </div>
      
    </section>
  </div>
</template>
<script>
export default {
  asyncData({ req }) {
    return {
      name: req ? "server" : "client"
    };
  },
  head() {
    return {
      title: `About Page (${this.name}-side)`
    };
  }
};
</script>

<style scoped>
</style>
