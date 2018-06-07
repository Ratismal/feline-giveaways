<template>
  <div class='box'>
    <section class='container'>
      <h1 class="title center">
        Create a Giveaway
      </h1>

      <giveaway-form/>
      
    </section>
  </div>
</template>

<script>
import GiveawayForm from "~/components/GiveawayForm.vue";

export default {
  components: { GiveawayForm }
};
</script>


<style scoped>
.checkbox-container {
  margin: 10px 0;
}
.required {
  content: "*";
  color: red;
  display: inline;
}
</style>
