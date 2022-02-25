/* eslint-disable */
// Pathify
import { make } from 'vuex-pathify'

// router 
import router from '../../router/index'


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
      title: 'User Profile',
      icon: 'mdi-account',
      items:[
        {
          title: "Profile", 
          icon: "mdi-account", 
          to: "/dashboard/profile"
        }
      ]
    },
    {
      title: 'Doctors',
      icon: 'mdi-doctor',
      to: '/dashboard/doctors',
      items:[
        {
          title: "Doctors", 
          icon: "mdi-file-table-box-multiple", 
          to: "/dashboard/doctors"
        },
        {
          title: "register", 
          icon: "mdi-plus", 
          to: "/dashboard/doctors/register"
        }
      ]
    },
    {
      title: 'Pharmacies',
      icon: 'mdi-hospital',
      to: '/dashboard/pharmacies',
      items:[
        {
          title: "Pharmacies", 
          icon: "mdi-file-table-box-multiple", 
          to: "/dashboard/pharmacies"
        },
        {
          title: "register", 
          icon: "mdi-plus", 
          to: "/dashboard/pharmacies/register"
        }
      ]
    },
    {
      title: 'Medical Reps',
      icon: 'mdi-sale',
      to: '/dashboard/medreps',
      items:[
        {
          title: "Medical", 
          icon: "mdi-file-table-box-multiple", 
          to: "/dashboard/medreps"
        },
        {
          title: "register", 
          icon: "mdi-plus", 
          to: "/dashboard/medreps/register"
        }
      ]
    },
    {
      title: 'Hospitals',
      icon: 'mdi-hospital-building',
      to: '/dashboard/hospitals',
      items:[
        {
          title: "Hospitals", 
          icon: "mdi-file-table-box-multiple", 
          to: "/dashboard/hospitals"
        },
        {
          title: "register", 
          icon: "mdi-plus", 
          to: "/dashboard/hospitals/register"
        }
      ]
    },
    {
      title: 'Products',
      icon: 'mdi-cube-outline',
      to: '/dashboard/products',
      items:[
        {
          title: "Products", 
          icon: "mdi-file-table-box-multiple", 
          to: "/dashboard/products"
        },
        {
          title: "register", 
          icon: "mdi-plus", 
          to: "/dashboard/products/register"
        }
      ]
    },
    {
      title: 'Manufacturers',
      icon: 'mdi-factory',
      to: '/dashboard/manufacturers',
      items:[
        {
          title: "Manufacturers", 
          icon: "mdi-file-table-box-multiple", 
          to: "/dashboard/manufacturers"
        },
        {
          title: "register", 
          icon: "mdi-plus", 
          to: "/dashboard/manufacturers/register"
        }
      ]
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
  appbarPageButtonnsCollections:{
    Hospital:[
      {
        icon:'mdi-plus-circle',
        path:'/dashboard/hospitals/register'
      },
    ],
    MedicalRep:[
      {
        icon:'mdi-plus-circle',
        path:'/dashboard/medreps/register'
      }
    ],
    Pharmacy:[
      {
        icon:'mdi-plus-circle',
        path:'/dashboard/pharmacies/register'
      }
    ], 
  }
}

const mutations = make.mutations(state)

const actions = {
  ...make.actions(state),
  init: async ({ dispatch }) => {
  },
}

const getters = {
  appbarPageButtonns(state){
    console.log('taking care',router.currentRoute.name)
    return state.appbarPageButtonnsCollections[router.currentRoute.name]
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
