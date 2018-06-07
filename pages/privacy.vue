<template>
  <div class='box'>
    <section class='container'>
      <h1 class="title center">
        Privacy Policy
        <span class='subtitle'>Version {{ version }}</span>
      </h1>
      
      <p class='center'>By using Feline Giveaways, I acknowledge and agree that the service</P>
      <ol class='terms-list'>
        <li>may look up my username, discriminator, ID, and avatar as a general authentication procedure</li>
        <li>keeps track of which giveaways I've created and/or entered into</li>
        <li>may share the list of members who entered a giveaway with the giveaway's creator</li>
        <li>may store whether I've agreed to these terms</li>
      </ol>
      <div v-if="$store.state.user !== null && !accepted" class='flex-row'>
        <a class="flex-row-item" @click.prevent="logout">
          Log Out
        </a>
        <div class='flex-row-separator'></div>          
        <a class="flex-row-item" @click.prevent="accept">
          Accept
        </a>
      </div>
      <div v-else class='flex-row'>
        <a class="flex-row-item" @click.prevent="$router.go(-1);">
          Back
        </a>
        <div v-if="$store.state.user !== null" class='flex-row-separator'></div>
        <a v-if="$store.state.user !== null" class="flex-row-item" @click.prevent="reject">
          Reject
        </a>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  asyncData({ req, store }) {
    return {
      confirmation: store.state.user !== null,
      version: store.state.privacyVersion
    };
  },
  computed: {
    accepted() {
      return this.$store.state.user.privacyAccept === this.version;
    }
  },
  head() {
    return {
      title: `About Page (${this.name}-side)`
    };
  },
  methods: {
    accept() {
      this.$axios.post("/privacy", { accept: this.version });
      this.$store.commit("setUserPrivacy", this.version);
      if (localStorage.returnTo) {
        this.$router.push(localStorage.returnTo);
        localStorage.removeItem("returnTo");
      } else this.$router.push("/");
    },
    reject() {
      this.$axios.post("/privacy", { accept: false });
      this.$store.commit("setUserPrivacy", false);
      this.$router.push("/privacy");
    },
    logout() {
      localStorage.removeItem("token");
      this.$store.commit("setUser", null);
    }
  }
};
</script>

<style scoped>
@media only screen and (max-width: 768px) {
  .terms-list {
    max-width: 280px !important;
  }
}

.terms-list {
  text-align: center;
  max-width: 400px;
  margin: 0 auto 50px auto;
}
.terms-list > li {
  margin: 10px 0;
  line-height: 1.5em;
}
</style>
