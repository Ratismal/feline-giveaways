<template>
  <div class='box'>
    <section class='container'>
      <h1 class="title center">
          Manage Giveaways
      </h1>
      
      <div v-if="ongoing.length === 0 && expired.length === 0">
        You do not have any giveaways.
      </div>

      <div v-if="ongoing.length > 0">
        <h2 class='center title'>Ongoing</h2>
        <div class='grid-container'>
          <div v-for="g of ongoing" :key="g.id" class='grid-span-2'>
            <giveaway-card :g="g"/>
          </div>
        </div>
      </div>
      <div v-if="expired.length > 0">
        <h2 class='center title'>Expired</h2>
        <div class='grid-container'>
          <div v-for="g of expired" :key="g.id" class='grid-span-2'>
            <giveaway-card :g="g"/>
          </div>
        </div>
      </div>

    </section>
  </div>
</template>
<script>
import GiveawayCard from "~/components/GiveawayCard.vue";

export default {
  components: { GiveawayCard },
  asyncData({ params, $axios, $router }) {
    return $axios
      .$get("/giveaways")
      .then(data => {
        return Object.assign(data);
      })
      .catch(err => {});
  },
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  head() {
    return {};
  },
  methods: {
    editGiveaway() {}
  }
};
</script>

<style scoped>
</style>
