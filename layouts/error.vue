<template>
  <div class='box'>
    <section class='container'>
      <h1 class="title center">
        oops, {{ error.statusCode }}
      </h1>
      <p class='center'>{{ error.message }}</p>
      <div class='flex-row'>
        <nuxt-link class="flex-row-item" to="/">
          Home
        </nuxt-link>
        <a class="flex-row-item" @click.prevent="$router.go(-1);">
          Back
        </a>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  props: ["error"]
};
</script>
