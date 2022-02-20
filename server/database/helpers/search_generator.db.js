module.exports = (fields, query_body)=>{
    if(!query_body?.search){
        return ''
    }
    const response = []
    for(field in fields){
        response.push(`${fields[field]} like "%${query_body.search}%"`)
    }
    if(response.length == 0){
        return ''
    }else{
        return ` ( ${response.join(' or ')} ) `
        
    }
}