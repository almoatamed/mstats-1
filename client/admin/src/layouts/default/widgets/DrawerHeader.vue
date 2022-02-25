<template>
  <v-list-item class="mb-0 justify-space-between pl-3">
    <v-list-item-icon>
      <v-img
        :src="
          require('@/assets/AG-Avatar.svg')"
        max-width="40"
      />
    </v-list-item-icon>

    <v-list-item-content>
      <v-list-item-title class="text-h4">
        <strong class="mr-1 font-weight-black">Al Amal Group</strong>
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
  // Utilities
  import { get } from 'vuex-pathify'

  export default {
    name: 'DefaultDrawerHeader',

    computed: { version: get('app/version') },
  }
</script>
