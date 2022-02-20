// router instance 
const express = require('express')
const router  = express.Router()

// env 
const env = require('../../env')

// authenticater
const user_middleware    = require('../../middlewares/user.middleware')

// rules 
const rules   = require('../../utils/rules/index')

// database helpers
const pq = require('../../database/helpers/promise_query.db')
const tq = require('../../database/helpers/table_query.db')

router.post('/user_names', user_middleware.auth, async (request, response)=>{
    try{
        const query = `
            select user_name from user
        `
        let users_names = await pq(query)
        users_names = users_names.map(el=>{return el.user_name})
        response.status(env.response.status_codes.ok).json({result:{names:users_names}})
    }catch (error){
        response.status(env.response.status_codes.server_error).json({
            error:{err:error, msg:"server error", name:"user fetch names error"}
        }).end()
    }
})

router.post('/',user_middleware.auth, (request,response)=>{
     try{
        // console.log(request.body)
        const query_body = request.body
        query_body.search_fields = query_body.search_fields?.length >0 ? query_body.search_fields : ['user_name', 'phone_number', 'address', 'name']
        query_body.selected_fields = query_body.headers?.length > 0 ? query_body.headers : [ 'user_name', 'phone_number', 'address', 'name', 'updated_at']
        tq('user', query_body).then(result=>{
            response.status(env.response.status_codes.ok).json(result).end()
        }).catch(err=>{
            response.status(err.status_code).json(err).end()
        })
    }catch (error){
        response.status(env.response.status_codes.server_error).json({
            error:{err:error, msg:"server error", name:"user fetch error"}
        }).end()
    }

})


module.exports = router