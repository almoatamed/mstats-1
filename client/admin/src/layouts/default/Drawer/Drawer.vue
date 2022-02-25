<template>
  <!-- eslint-disable -->
  <v-navigation-drawer
    id="default-drawer"
    v-model="drawer"
    :dark="dark_gradiant"
    :right="$vuetify.rtl"
    :src="drawerImage ? image : ''"
    :mini-variant.sync="mini"
    mini-variant-width="80"
    app
    active-class
    width="260"
  >
    <!-- Drawer color -->
    <template v-if="drawerImage" #img="props">
      <v-img :key="image" :gradient="gradient || ''" v-bind="props" />
    </template>

    <!-- Drawer Body (content) -->
    <div class="px-2">
      <default-drawer-header />

      <v-divider class="mx-3 mb-2" />

      <default-list :items="items" />
    </div>

    <!-- Drawer Footer -->
    <template #append>
      <v-list-item class="mb-0 justify-space-between pl-1">
        <v-list-item-icon>
          <v-img :src="require('../../../assets/Aram_Icon.svg')" max-width="60" />
        </v-list-item-icon>
      </v-list-item>
    </template>

    <div class="pt-12" />
  </v-navigation-drawer>
</template>

<script>
// Utilities
/* eslint-disable */
import { get, sync } from "vuex-pathify";

export default {
  name: "DefaultDrawer",

  components: {
    DefaultDrawerHeader: () =>
      import(
        /* webpackChunkName: "default-drawer-header" */
        "../widgets/DrawerHeader"
      ),
    DefaultList: () =>
      import(
        /* webpackChunkName: "default-list" */
        "./List"
      )
  },

  computed: {
    ...get("user", ["dark_gradiant", "gradient", "image"]),
    ...get("app", ["items", "version"]),
    ...sync("app", ["drawer", "drawerImage", "mini"])
  }
};
</script>

<style lang="sass">
#default-drawer
  .v-list-item
    margin-bottom: 8px

  .v-list-item::before,
  .v-list-item::after
    display: none

  .v-list-group__header__prepend-icon,
  .v-list-item__icon
    margin-top: 12px
    margin-bottom: 12px
    margin-left: 4px

  &.v-navigation-drawer--mini-variant
    .v-list-item
      justify-content: flex-start !important
</style>
