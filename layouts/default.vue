<template>
  <div>
    <nuxt/>
  </div>
</template>

<script>
export default {
  components: {},
  mounted() {
    if (
      this.$store.state.user &&
      this.$store.state.user.privacyAccept !==
        this.$store.state.privacyVersion &&
      this.$router.currentRoute.path !== "/privacy"
    ) {
      this.$router.push("/privacy");
    }
  },
  watch: {
    $route: function() {
      if (
        this.$store.state.user &&
        this.$store.state.user.privacyAccept !==
          this.$store.state.privacyVersion &&
        this.$router.currentRoute.path !== "/privacy"
      ) {
        this.$router.push("/privacy");
      }
    }
  }
};
</script>

<style>
</style>
