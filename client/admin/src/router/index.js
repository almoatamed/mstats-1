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
        {
          ...route('Login'),
          meta:{requiresVisitor:true},
        },

        // Errors
        route('Error', null, 'error'),

        // Suppport Page
        route('Support', null, 'support'),

      ]),
      meta:{
      }

    },

    {
      ...layout('Default', [
        route('Dashboard'),

        // Pages
        route('UserProfile', null, 'components/profile'),

        // Components
        route('Notifications', null, 'components/notifications'),
        route('Icons', null, 'components/icons'),
        route('Typography', null, 'components/typography'),

        // Tables
        route('Regular Tables', null, 'tables/regular'),

        // Maps
        route('Google Maps', null, 'maps/google'),
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
