<template>
  <div>
    <a class='dropdown button small' @click="toggle">
      {{ title || (triggered ? titleEnabled : titleDisabled) }}
    </a>
    <div :class='"dropdown-content " + (triggered ? "expanded" : "")'>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'titleEnabled', 'titleDisabled'],
  data() {
    return {
      triggered: false
      // height: 0
    };
  },
  computed: {
  },
  mounted() {
  },
  methods: {
    toggle() {
      this.triggered = !this.triggered;
    }
  }
};  
</script>

<style scoped>
.dropdown-content {
  margin: 0 5px;
  padding: 0;
  transition-duration: 0.5s;
  height: 1px;
  overflow: hidden;
}
.dropdown-content.expanded {
  height: auto;
}
</style>
