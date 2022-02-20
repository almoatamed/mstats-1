/* eslint-disable */
import axios from 'axios'
import store from '../../store/index'

// let baseURL = 'http://localhost:3000'
// if(window.navigator.userAgent.indexOf('Linux') !== -1){
//   baseURL = location.origin
// }

let baseURL = location.origin
console.log(baseURL)
const Api = axios.create({
  timeout: 2000,
  baseURL: `${baseURL}/server/api/`,
})

Api.interceptors.request.use(function (config) {
  if (store.getters['user/auth']) {
    config.headers.Authorization = store.getters['user/token']
  } 
  return config
})

Api.interceptors.response.use(function(response){
    return response
}, function (error) {
    console.log(error.name, error.message, error.code)
    const response = error.response
    if(response?.status == 421){
        store.dispatch('user/logout',null, {root:true})
    }
    return new Promise((resulve, reject)=>{reject(error)})
})

export default Api
