<template>
  <div class='box'>
    <section class='container'>
      <h1 class="title center">
        Edit Giveaway
      </h1>
      <h2 class='title center maintain-case'>
        {{ data.title }}
        <span class='subtitle maintain-case'>{{ data.description }}</span>
      </h2>

      <giveaway-form :edit="true" :id="id" :data="data"/>
      
    </section>
  </div>
</template>
<script>
import GiveawayForm from "~/components/GiveawayForm.vue";
export default {
  components: { GiveawayForm },
  asyncData({ params, $axios }) {
    return $axios.$get("/giveaway/" + params.id).then(data => {
      data.data.endDate = window.moment(data.data.endDate);
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
