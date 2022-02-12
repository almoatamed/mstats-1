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
  import Links from '@/components/Links'

  export default {
    name: 'PageFooter',

    components: { Links },
  }
</script>
