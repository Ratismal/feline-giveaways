<template>
  <div>
    <nuxt/>
    <welcome v-if="$store.state.user"/>    
  </div>
</template>

<script>
import Welcome from '../components/Welcome.vue';

export default {
  components: {Welcome},
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
