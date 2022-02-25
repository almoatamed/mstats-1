<template>
  <!-- eslint-disable -->
  <v-app-bar
    id="default-app-bar"
    app
    absolute
    class="v-bar--underline"
    color="transparent"
    :clipped-left="$vuetify.rtl"
    :clipped-right="!$vuetify.rtl"
    height="70"
    flat
  >
    <v-app-bar-nav-icon
      class="hidden-md-and-up"
      @click="drawer = !drawer"
    />

    <default-drawer-toggle class="hidden-sm-and-down" />

    <v-toolbar-title
      class="font-weight-light text-h5"
      v-text="name.replace(/([a-z0-9])([A-Z])/g, '$1 $2')"
    />
    <div class="pl-4" v-if="isIcons">
      <v-icon
        v-for="(icon,index) in appbarPageButtonns"
        :key="index"
        class="primary--text text-h2"
        @click="$router.push(icon.path)"
      >
        {{icon.icon}}
      </v-icon>
    </div>

    <v-spacer />

    <default-search class="hidden-sm-and-down" />

    <default-go-home />
    <default-notifications />

    <default-account />
  </v-app-bar>
</template>

<script>
  /* eslint-disable */
  // Utilities
  import { get, sync } from 'vuex-pathify'

  export default {
    name: 'DefaultBar',

    components: {
      DefaultAccount: () => import(
        /* webpackChunkName: "default-account" */
        '../widgets/Account'
      ),
      DefaultDrawerToggle: () => import(
        /* webpackChunkName: "default-drawer-toggle" */
        '../widgets/DrawerToggle'
      ),
      DefaultGoHome: () => import(
        /* webpackChunkName: "default-go-home" */
        '../widgets/GoHome'
      ),
      DefaultNotifications: () => import(
        /* webpackChunkName: "default-notifications" */
        '../widgets/Notifications'
      ),
      DefaultSearch: () => import(
        /* webpackChunkName: "default-search" */
        '../widgets/Search'
      ),
    },

    computed: {
      ...sync('app', [
        'drawer',
        'mini',
        'appbarPageButtonnsCollections'
      ]),
      name: get('route/name'),
      appbarPageButtonns(){
        console.log(this.appbarPageButtonnsCollections)
        return this.appbarPageButtonnsCollections[this.$route.name]
      },
      isIcons(){
        return this.appbarPageButtonns?.length > 0
      }
    }
  }
</script>
