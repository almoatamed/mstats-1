
const normalizedPath = require('path').join(__dirname,'filter_handlers')
const filter_handlers = {
}
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  let index = file.indexOf('.filter_handler.js')
  if(index != -1){
      filter_handlers[file.slice(0,index)]= require(`./filter_handlers/${file}`)
  }
});
module.exports = async ( query_body ) =>{
    if(!query_body?.filters){
        return ''
    }
    const filters = query_body.filters
    const response = []
    for (const key in filters) {
        if (Object.hasOwnProperty.call(filter_handlers,key)) {
            let query_condition = await filter_handlers[key](filters[key]) 
            if(query_condition){
                response.push(query_condition)
            }
        }
    }
    if(response.length >1){
        return ' ( ' + response.join(' and ') + ' ) '
    }else if(response.length == 1){
        return ' ' + response.join(' and ') + ' '
    }else{ 
        return ''
    }
}