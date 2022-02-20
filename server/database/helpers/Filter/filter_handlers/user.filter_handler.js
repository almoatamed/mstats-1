
module.exports = (filter)=>{
    if(!filter.values.names){
        return ''
    }
    if(filter.values.names.length == 0){
        return ''
    }
    return ` ( created_by_user in ( '${filter.values.names.join('\', \'')}' ) ) `
}