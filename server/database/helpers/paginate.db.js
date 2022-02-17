const pq  =  require('./promise_query.db')
const env = require('../../env')

module.exports = function(query, n_per_page, page=1){
    return new Promise(async(resolve, reject)=>{
        try {
            const count_query = `
                select count(*) n
                from 
                (
                    ${query}
                ) user_query
            `
            
            let count = await pq(count_query)
            count = count[0].n
            let number_of_pages = Math.ceil(count/n_per_page)
            if((page>number_of_pages || page < 1) && page != 1){
                return reject({error:{err:{}, msg:"page out of range", name:"pagination error"},status_code:env.response.status_codes.not_found})
            }
            const paginate_query = `
                select * 
                from 
                (
                    select @row_number:=@row_number+1 as nn,output.*
                    from 
                    (${query}) output, (SELECT @row_number:=0) as r
                ) final
                where 
                final.nn between ${n_per_page*(page-1)} and ${n_per_page*(page) -1}
                ;
            `
            result = await pq(paginate_query)
            resolve(result)
            
        } catch (error) {
            reject({error:{err:error, msg:"server error", name:"pagination error"},status_code:env.response.status_codes.server_error})
        }
    })
}