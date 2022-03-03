// router instance 
const express = require('express')
const router  = express.Router()

// env 
const env = require('../../env')

// authenticater
const user_middleware    = require('../../middlewares/user.middleware')

// database helpers
const pq = require('../../database/helpers/promise_query.db')
const tq = require('../../database/helpers/table_query.db')

router.post('/',user_middleware.auth, (request,response)=>{
     try{
        // console.log(request.body)
        const query_body = request.body
        query_body.search_fields = query_body.search_fields?.length >0 ? query_body.search_fields : ['doctor_name', 'prescription_name', 'status', 'printed']
        query_body.selected_fields = query_body.headers?.length > 0 ? query_body.headers : [ 'sheet_id','doctor_name', 'prescription_name', 'status', 'printed', 'pharmacy_name', 'updated_at']
        const table = `
            \n(
                \n    select \
                \n    s.sheet_id as sheet_id,\
                \n    (select d.name from doctors d where d.doctor_id = s.doctor_id  limit 1) as doctor_name,\
                \n    (select p.name from prescriptions p where p.prescription_id = s.prescription_id limit 1) as prescription_name,\
                \n    (select ss.name from sheet_status ss where ss.sheet_status_id = (s.status+1) limit 1) as status,\
                \n    (select ph.name from pharmacies ph where ph.pharmacy_id = s.pharmacy_id limit 1) as pharmacy_name,\
                \n    (select sp.name from sheet_printed sp where sp.sheet_printed_id = (s.printed+1) limit 1) as printed,\
                \n    s.updated_at as updated_at,\
                \n    s.created_by_user as created_by_user,\
                \n    s.deleted as deleted\
                \n    from \
                \n    sheets as s\
            \n)
        `
        tq(table, query_body).then(result=>{
            return response.status(env.response.status_codes.ok).json(result).end()
        }).catch(err=>{
            console.log(err)
            return response.status(err.status_code).json(err).end()
        })
    }catch (error){
        console.log(error)
        if(!response.headersSent){
            return response.status(env.response.status_codes.server_error).json({
                error:{err:error, msg:"server error", name:"user fetch error"}
            }).end()
        }
    }

})


module.exports = router