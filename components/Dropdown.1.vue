<template>
  <div>
    <a class='dropdown button small' @click="toggle">
      {{ title || (triggered ? titleEnabled : titleDisabled) }}
    </a>
    <div class='dropdown-content-outer' :style='"max-height: " + (this.triggered ? this.height : 0) + "px"'>
      <div class='dropdown-content' ref='dropdownContent'>
        <slot></slot>
      </div>
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
    height() {
      return this.$refs.dropdownContent.scrollHeight;
    }
  },
  mounted() {
    this.$root.$on('dropdown-resize', () => {
      // this.calculateHeight();
      // this.$refs.dropdownContent.scrollHeight;
      this.$refs.dropdownContent.classList.toggle('debug');
      console.log(this.title || this.titleEnabled, this.height);
    });
  },
  methods: {
    toggle() {
      this.triggered = !this.triggered;
      let content = this.$refs.dropdownContent;
      let outer = content.parentNode;
      this.$root.$emit('dropdown-resize');
    },
    calculateHeight() {
      let content = this.$refs.dropdownContent;
      content.classList.toggle('get-height');
      // this.height = content.clientHeight;
      content.classList.toggle('get-height');      
    }
  }
};  
</script>

<style scoped>
.get-height {
  opacity: 0;
  left: 0;
  top: 0;
  position: fixed;
}
.dropdown-content-outer {
  max-height: 0px;
  margin: 0;
  padding: 0;
  transition-duration: 0.5s;
  height: auto;
  overflow: hidden;
}
.dropdown-content.toggled {
  max-height: 1000px;
}

.temp-obj {
  display: block;
  width: 300px;
  height: 100px;
  background: rgba(255, 255, 255, 0.4);
}
</style>
