<template>
  <div>
    <div class='giveaway-card'>
      <div class='giveaway-flex'>
        <span class='title center'>{{ g.data.title }}</span>
        <span v-if="g.beta" class='beta maintain-case'>BETA</span>

        <div class='button-bar'>
          <nuxt-link class='button small' :to="'/giveaway/' + g.id">View</nuxt-link>
          <nuxt-link class='button small' :to="'/giveaway/' + g.id + '/edit'">Edit</nuxt-link>
          <a class='button small' @click.prevent="copyGiveaway">Copy</a>
          <nuxt-link class='button small danger hover text-danger' :to="'/giveaway/' + g.id + '/delete'">Delete</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["g"],
  mounted() {},
  methods: {
    copyGiveaway() {
      localStorage.draft = JSON.stringify(this.g.data);
      this.$router.push("/create");
    }
  }
};
</script>

<style scoped>
.giveaway-card {
  display: block;
  border-radius: 5px;
  background: rgba(0, 100, 100, 0.3);
  height: 100px;
  padding: 5px;
  position: relative;
}
.title {
  display: block;
  margin: 0;
  flex: 1;
}

.beta {
  display: block;
  color: red;
  position: absolute;
  right: 10px;
  top: 5px;
  padding: 3px;

  border-radius: 5px;
  border: 1px red solid;
  font-size: 0.6em;
  user-select: none;
}

.button-bar {
  min-width: initial;
  margin: 0 5px;
  width: 100%;
}
.button-bar .button,
.button-bar .button:hover {
  margin: 5px 5px;
  width: initial !important;
}

.giveaway-flex {
  display: flex;
  flex-flow: column;
  height: 100%;
  align-items: center;
  align-content: center;
  vertical-align: middle;
  justify-content: center;
}
</style>
