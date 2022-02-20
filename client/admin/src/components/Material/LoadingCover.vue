<template>
  <div
    v-if="loading_cover"
    class="loading_cover"
  >
    <v-progress-circular
      :size="70"
      :width="7"
      class="laoding_cover_progresser"
      color="purple"
      indeterminate
    />
  </div>
</template>

<script>
 /* eslint-disabled */
  import { get } from 'vuex-pathify'
  export default {
    name: 'LoadingCover',
    computed: {
      ...get('user', {
        loading_cover: 'visualization@loading_cover',
      },
      ),
    },
  }
</script>

<style>
  .loading_cover{
    position: absolute;
    top:0px;
    bottom: 0px;
    width: 100%;
    height: 100%;
    z-index: 100;
    background-color: aliceblue;
  }
  .laoding_cover_progresser{
      position:absolute;
      top:50%;
      left: 50%;
      transform: translate(-50%,-50%);
  }
</style>
