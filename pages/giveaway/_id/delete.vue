<template>
  <div class='box'>
    <section class='container'>
      <h1 class="title center">
        Delete Giveaway
      </h1>
      <h2 class='title center maintain-case'>
        {{ data.title }}
        <span class='subtitle maintain-case'>{{ data.description }}</span>
      </h2>

      <p class='center'>Are you sure you want to delete this giveaway? There's no way to undo this!</P>

      <div class='button-bar'>
        <nuxt-link class='button' to='/manage'>No</nuxt-link>
        <a class='button' @click.prevent='deleteGiveaway'>Yes</a>
      </div>
      
    </section>
  </div>
</template>
<script>
export default {
  asyncData({ params, $axios }) {
    return $axios.$get("/giveaway/" + params.id).then(data => {
      return data;
    });
  },
  methods: {
    async deleteGiveaway() {
      await this.$axios.$delete("/giveaway/" + this.id);
      this.$router.push("/manage");
    }
  }
};
</script>

<style scoped>
</style>
