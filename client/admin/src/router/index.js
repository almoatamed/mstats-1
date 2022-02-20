/* eslint-disable */
// Imports
import Vue from 'vue'
import Router from 'vue-router'
import {
  layout,
  route,
} from '@/util/routes'
import store from '../store/index'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: (to, from, savedPosition) => {
    if (to.hash) return { selector: to.hash }
    if (savedPosition) return savedPosition

    return { x: 0, y: 0 }
  },
  routes: [

    {
      ...layout('Page', [
        // Junk
        route('Error', null, 'error'),
        route('Support', null, 'support'),

        // Auth
        route('Login',null,'','Auth/Login.vue'),
      ]),
      meta:{
      }

    },

    {
      ...layout('Default', [
        // Junk
        route('Dashboard',null,'','Junk/Dashboard.vue'),
        route('UserProfile', null, 'components/profile','Junk/UserProfile.vue'),
        route('Notifications', null, 'components/notifications','Junk/Notifications.vue'),
        route('Icons', null, 'components/icons','Junk/Icons.vue'),
        route('Typography', null, 'components/typography','Junk/Typography.vue'),
        route('Regular Tables', null, 'tables/regular','Junk/RegularTabbles.vue'),
        route('Google Maps', null, 'maps/google','Junk/GoogleMaps.vue'),

        // User
        route('User Status Table', null,'user/status_table', 'User/UserStatusTable.vue')

      ], '/dashboard'),
      meta:{RequiresAuth:true}
    },
  ],
})

router.beforeEach((to, from, next) => {
  console.log(
    'Routing ......', 
    '\n', to.fullPath, 
    '\n', from.fullPath, 
  )
  let auth =  store.getters['user/auth']
  if (to.matched.some(record => record.meta.RequiresAuth)) {
    console.log('requires authorization, auth: ',auth)
    if (!auth) {
      next({
        name: "Login",
        query: { redirect: to.fullPath }
      });
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresVisitor)) {
    console.log('requires visitor, auth: ', auth)
    if (auth) {
      next("/dashboard");
    } else {
      next();
    }
  } else {
    next();
  }
})



export default router
