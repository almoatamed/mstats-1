<template>
  <v-footer
    id="page-footer"
    :absolute="$vuetify.breakpoint.mdAndUp"
    color="transparent"
    height="auto"
  >
    <links />
  </v-footer>
</template>

<script>
  // Components

  export default {
    name: 'PageFooter',
  }
</script>
