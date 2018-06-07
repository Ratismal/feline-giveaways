<template>
  <div class='box'>
    <section class='container'>
      <h1 class="title center maintain-case">
          manage
        <span class='subtitle maintain-case'>ok</span>
      </h1>
      
      

    </section>
  </div>
</template>
<script>
export default {
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
.countdown {
  display: block;
  width: 100%;
  font-size: 3em;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.winner {
  font-size: 1.4em;
  text-align: center;
  margin: 0 auto;
  display: block;
  letter-spacing: 1.5px;
}
.winner-avatar {
  display: block;
  margin: 10px auto;
  border-radius: 100px;
}
</style>
