
<style scoped>
  .coin-avatar{
    width: 1.1rem;
    height: 1.1rem;
    margin-bottom: 0.2em;
  }
</style>

<template>
  <img
    :src="`/coin-icons/${coin.network}/${coin.code}.png`"
    class="coin-avatar"
    :style="{width: size + 'rem', height: size+'rem'}"
  />
</template>

<script>
  export default {
    props: {
      coin: {type: Object},
      size: {
        type: [String, Number],
        default: 1.1
      }
    }
  }
</script>
