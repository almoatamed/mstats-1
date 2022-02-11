/* eslint-disable */
// Utilities
import { make } from 'vuex-pathify'

// user api
import userApi from '../../api/user/index'

// Globals
import { IN_BROWSER } from '@/util/globals'

// router 
import router from '../../router/index'

const state = JSON.parse(localStorage.getItem('aramtech@user')) || {
  visualization: {
    loading_cover: false,
    dark: false,
    drawer: {
      image: 0,
      gradient: 0,
      mini: false,
    },
    gradients: [
      'rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)',
      'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)',
      'rgba(244, 67, 54, .8), rgba(244, 67, 54, .8)',
    ],
    images: [
    ],
    rtl: false,

  },
  notification: {
    notification: false,
    msg:'',
    color:'warning',
    v:'top',
    h:'center',
  },
  auth:{
    token: ''
  }
}

const mutations = {
  // default mudations
  ...make.mutations(state),
  DARK(state,value){
    state.visualization.dark = value
  },
  TOKEN(state, value){
    state.auth.token = value
  },
  NOTIFY(state, notification){
    state.notification.notification =true
    state.notification.msg = notification.msg 
    state.notification.color = notification.color
    state.notification.h = 'center'
    if(router.currentRoute.name.indexOf('dashboard') == -1){
      state.notification.v = 'top'
    }else{
      state.notification.v = 'bottom'
    }
  }
}

const actions = {
  
  // auth   
  set_token(context,token){
    console.log('commiting token ', token)
    if(token){
      context.commit('TOKEN', token)
    }else{
      context.commit('TOKEN', '')
    }
    context.dispatch('update_localstorage')
  },
  verify(){
    return new Promise((resolve, reject)=>{
      userApi.verify().then(res=>{resolve(res)}).catch(err=>{reject(err)})
    })
  },


  // login/logout
  login(context, body){
    return new Promise((resolve, reject)=>{
      userApi.login(body).then(res => {
            context.dispatch('user/set_token', res.data.result.token,{root:true})
            resolve(res)
        }).catch(err => {
            context.dispatch('user/set_token',null, {root:true})
            reject(err);
        })
    })
  },
  logout(context){
    context.dispatch('set_token')
    if(router.currentRoute.fullPath != '/'){
      router.push('/')
    }
  },


  // notification 
  notify(context,notification){
    context.commit("NOTIFY", notification)
  },


  // local storage 
  fetch_localstorage: async ({ commit }) => {
    const local = await localStorage.getItem('aramtech@user') || '{}'
    const user = await JSON.parse(local)

    for (const key in user) {
      await commit(key, user[key])
    }

    if (user.visualization.dark === undefined) {
      await commit('DARK', window.matchMedia('(prefers-color-scheme: dark)'))
    }
    return new Promise(resolve=>resolve())
  },
  update_localstorage: ({ state }) => {
    if (!IN_BROWSER) return
    localStorage.setItem('aramtech@user', JSON.stringify(state))
  },
}

const getters = {
  // auth 
  auth: (state) =>{
    return !!state.auth.token
  },
  token: (state) => {
    return state.auth.token
  },

  // visual getters 
  dark: (state, getters) => {
    return (
      state.visualization.dark ||
      getters.visualization.gradient.indexOf('255, 255, 255') === -1
    )
  },
  gradient: state => {
    return state.visualization.gradients[state.visualization.drawer.gradient]
  },
  image: state => {
    return state.visualization.drawer.image === '' ? state.visualization.drawer.image : state.visualization.images[state.visualization.drawer.image]
  },
}



export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
