const jwt = require('jsonwebtoken')
const env = require('../../env')

module.exports = {
    generate:(obj)=>jwt.sign(obj,env.auth.jwt.secret),
    verify:(token,cb)=>{
        jwt.verify(token, env.auth.jwt.secret, cb)
    },
}