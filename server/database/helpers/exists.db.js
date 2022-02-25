const env = require('../../env')
const pq = require('./promise_query.db')
const one = async (table,field,value) => {
  const query = `select * from ${table} where ${field} = '${value}' and deleted = 0 limit 1`
  console.log(query)
  let val = (await pq(query))[0]
  if (!val) {
      return false
  }else{
      return val
  }
};

const validate_one = async (table,field,value) => {
    const val = await one(table,field,value)
    if(!val){
        throw {error:{msg:`${field} ${value} not found`},status_code:env.response.status_codes.not_found}
    }else{
        return val
    }
};

const valdiate_arr = async (table,field,values) =>{
    for(const val of (values || [])){
        await validate_one(table,field,val)
    }
}

module.exports = {
    one,validate_one,valdiate_arr
}