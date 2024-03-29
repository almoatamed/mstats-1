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
            let result = []
            let number_of_pages  =1
            if(n_per_page > 0){
                number_of_pages = Math.ceil(count/n_per_page)
                if((page>number_of_pages || page < 1) && page != 1){
                    page = number_of_pages
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
                    final.nn between ${n_per_page*(page-1) + 1} and ${n_per_page*(page)}
                    ;
                `
                result = await pq(paginate_query)
            }else if (n_per_page == -1){
                page = 1
                const paginate_query = `
                    select @row_number:=@row_number+1 as nn,output.*
                    from 
                    (${query}) output, (SELECT @row_number:=0) as r
                `
                result = await pq(paginate_query)
            }else{
                return reject({error:{msg:"element per page is invalid (can't be zero)", name:"pagination error"},status_code:env.response.status_codes.invalid_field})
            }
            resolve({result:{result, number_of_pages, page, n_per_page, total_number: count }})
            
        } catch (error) {
            reject({error:{err:error, msg:"server error", name:"pagination error"},status_code:env.response.status_codes.server_error})
        }
    })
}