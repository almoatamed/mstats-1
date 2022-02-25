
const pq = require('./../../promise_query.db')
module.exports = async (filter)=>{
    if(!filter.values?.names){
        return ''
    }
    if(filter.values?.names?.length === 0){
        return ''
    }
    const user_ids = (await pq(`
        select user_id from user where user_name in ( '${filter.values?.names.join('\', \'')}' )
    `)).map(el=>el.user_id)

    return ` ( created_by_user in ( '${user_ids.join('\', \'')}' ) ) `
}