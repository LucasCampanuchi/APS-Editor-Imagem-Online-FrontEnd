<template>

<div class="modal">
  <div class="modal-background"></div>
  <div class="modal-content">
    <p class="image is-4by3">
      <q-img
            class="image"
            :src="urlImage"
            />
    </p>
  </div>
  <button class="modal-close is-large" aria-label="close"></button>
</div>
</template>

<script>
export default {
  data () {
    return {
      icon: true
    }
  },
  props: {
    urlImage: String
  },
  mounted () {
    console.log(',erda')
  }
}
</script>

<style>
.image{
    min-width: 800px;
}
</style>
