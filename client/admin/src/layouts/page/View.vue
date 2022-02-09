<template>
  <v-main>
    <v-img
      :key="src"
      :src="require(`@/assets/${src}`)"
      dark
      gradient="to top, #00000080, #00000080"
      min-height="100vh"
      :height="$vuetify.breakpoint.mdAndUp ? '100vh' : undefined"
    >
      <div
        :class="[$vuetify.breakpoint.mdAndUp && 'fill-height']"
        class="d-block d-md-flex"
      >
        <page-app-bar />

        <router-view />

        <page-footer />
      </div>
    </v-img>
  </v-main>
</template>

<script>
  // Utilities
  import { get } from 'vuex-pathify'

  export default {
    name: 'PageView',

    components: {
      PageAppBar: () => import('./AppBar'),
      PageFooter: () => import('./Footer'),
    },

    data: () => ({
      srcs: {
        '/': '15410.jpg',
        '/error/': '10222.webp',
      },
    }),

    computed: {
      path: get('route/path'),
      src () {
        return this.srcs[this.path] || 'clint-mckoy.jpg'
      },
    },
  }
</script>
