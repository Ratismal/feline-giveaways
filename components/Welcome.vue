<template>
  <div class='welcome'>
    <span>welcome, {{ $store.state.user.username }}#{{ $store.state.user.discriminator }}</span>
  </div>
</template>

<script>
export default {
    
};  
</script>