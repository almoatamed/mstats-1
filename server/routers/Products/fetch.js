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

router.post('/names', user_middleware.auth, async (request, response)=>{
    try{
        const query = `
            select name from products where deleted = 0
        `
        let names = await pq(query)
        names = names.map(el=>{return el.name})
        return response.status(env.response.status_codes.ok).json({result:{names:names}})
    }catch (error){
        if(!response.headersSent){
            return response.status(env.response.status_codes.server_error).json({
                error:{err:error, msg:"server error", name:"medical representative fetch names error"}
            }).end()
        }
    }
})

router.post('/',user_middleware.auth, (request,response)=>{
     try{
        // console.log(request.body)
        const query_body = request.body
        query_body.search_fields = query_body.search_fields?.length >0 ? query_body.search_fields : ['name', 'description']
        query_body.selected_fields = query_body.headers?.length > 0 ? query_body.headers : [ 'name', 'description', 'updated_at']
        tq('products', query_body).then(result=>{
            return response.status(env.response.status_codes.ok).json(result).end()
        }).catch(err=>{
            return response.status(err.status_code).json(err).end()
        })
    }catch (error){
        if(!response.headersSent){
            return response.status(env.response.status_codes.server_error).json({
                error:{err:error, msg:"server error", name:"user fetch error"}
            }).end()
        }
    }

})


module.exports = router