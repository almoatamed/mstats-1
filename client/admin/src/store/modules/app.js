/* eslint-disable */
// Pathify
import { make } from 'vuex-pathify'

// Data
const state = {
  drawer: null,
  drawerImage: true,
  mini: false,
  items: [
    {
      title: 'dashboard',
      icon: 'mdi-view-dashboard',
      to: '/dashboard',
    },
    {
      title: "data entry",
      icon: "mdi-pencil",
      items: [
        {
          title: 'user', 
          icon: 'mdi-account', 
          items:[
            {
              title: "register", 
              icon: "mdi-plus", 
              to: "/dashboard/data-entry/user/register"
            }
          ]
        },
        {
          title: 'Hospital', 
          icon: 'mdi-hospital-building', 
          items:[
            {
              title: "register", 
              icon: "mdi-plus", 
              to: "/dashboard/data-entry/hostpital/register"
            }
          ]
        }
      ],
    },
    // {
    //   title: 'User Profile',
    //   icon: 'mdi-account',
    //   to: '/components/profile/',
    // },
    // {
    //   title: 'Regular Tables',
    //   icon: 'mdi-clipboard-outline',
    //   to: '/tables/regular/',
    // },
    // {
    //   title: 'Typography',
    //   icon: 'mdi-format-font',
    //   to: '/components/typography/',
    // },
    // {
    //   title: 'Icons',
    //   icon: 'mdi-chart-bubble',
    //   to: '/components/icons/',
    // },
    // {
    //   title: 'Google Maps',
    //   icon: 'mdi-map-marker',
    //   to: '/maps/google/',
    // },
    // {
    //   title: 'Notifications',
    //   icon: 'mdi-bell',
    //   to: '/components/notifications/',
    // },
  ],
}

const mutations = make.mutations(state)

const actions = {
  ...make.actions(state),
  init: async ({ dispatch }) => {
  },
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
