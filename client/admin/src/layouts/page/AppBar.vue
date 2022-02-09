<template>
  <v-app-bar
    :absolute="$vuetify.breakpoint.mdAndUp"
    color="transparent"
    dark
    flat
    height="80"
  >
    <v-container class="px-0 d-flex align-center">
      <v-toolbar-title
        class="font-weight-light"
        v-text="`Aram Tech | Al Amal Group`"
      />
    </v-container>
  </v-app-bar>
</template>

<script>
// Utilities
  import { get } from 'vuex-pathify'

  export default {
    name: 'PageAppBar',

    data: () => ({}),

    computed: { name: get('route/name') },
  }
</script>
