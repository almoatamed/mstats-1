/* eslint-disable */
import Api from '../api/index'

export default {
    login(body){
        return new Promise((resolve, reject)=>{
            Api.post('user/auth/login',body).then(res=>{
                resolve(res);
            }).catch(err=>{
                reject(err)
            })
        })
    },
    verify(){
        return new Promise((resolve, reject)=>{
            console.log('hitting server')
            Api.post('user/auth/verify', {}).then(res=>{
                resolve(res)
            }).catch( err => {
                reject(err)
            })
        })
    }, 
    fetch(body){
        return new Promise((resolve, reject)=>{
            Api.post('user/fetch', body).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    }
}