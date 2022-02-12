<template>
  <v-app>
    <page-view />
  </v-app>
</template>

<script>
  export default {
    name: 'PageLayout',

    components: { PageView: () => import('./View') },
  }
</script>
