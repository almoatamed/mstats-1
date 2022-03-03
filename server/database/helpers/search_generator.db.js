module.exports = (fields, query_body)=>{
    if(!query_body?.search){
        return ''
    }
    const response = []
    for(field of fields){
        response.push(`${field} like "%${query_body.search}%"`)
    }
    if(response.length == 0){
        return ''
    }else{
        return ` ( ${response.join(' or ')} ) `
        
    }
}