<template>
  <v-app>
    <default-bar />

    <default-drawer />

    <default-view />

    <default-footer />

    <default-settings />
  </v-app>
</template>

<script>
  export default {
    name: 'DefaultLayout',

    components: {
      DefaultBar: () => import(
        /* webpackChunkName: "default-app-bar" */
        './Appbar/AppBar'
      ),
      DefaultDrawer: () => import(
        /* webpackChunkName: "default-drawer" */
        './Drawer/Drawer'
      ),
      DefaultFooter: () => import(
        /* webpackChunkName: "default-footer" */
        './Footer/Footer'
      ),
      DefaultSettings: () => import(
        /* webpackChunkName: "default-settings" */
        './widgets/Settings'
      ),
      DefaultView: () => import(
        /* webpackChunkName: "default-view" */
        './Body/View'
      ),
    },
  }
</script>
