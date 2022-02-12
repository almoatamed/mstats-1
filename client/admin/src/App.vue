<template>
  <v-app class="">
    <loading-cover />
    <v-fade-transition mode="out-in">
      <material-snackbar
        v-model="notification"
        v-bind="{
          [notification_v]: true,
          [notification_h]: true
        }"
        :type="notification_color"
        timeout="5000"
      >
        {{ notification_msg }}
      </material-snackbar>
    </v-fade-transition>
    <v-fade-transition mode="out-in">
      <router-view />
    </v-fade-transition>
  </v-app>
</template>

<script>
  /* eslint-disable */
  // Styles
  import '@/styles/overrides.sass'
import LoadingCover from './components/LoadingCover.vue'
import {sync} from 'vuex-pathify'

  export default {
  components: { LoadingCover },
    name: 'App',
    metaInfo: {
      title: 'Smart Prescription',
      titleTemplate: '%s | Aram Tech',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
    beforeCreate(){
      console.log('( App.vue, Beforecreated')
      this.$store.dispatch('app/init',null,{root:true})
      console.log('App.vue, Beforecreated )')
    },    
    created () {
    },
    computed: {
      ...sync('user', {
        notification: 'notification@notification',
        notification_msg: 'notification@msg',
        notification_v: 'notification@v',
        notification_h: 'notification@h',
        notification_color: 'notification@color',
        },),
    },
  }
</script>
