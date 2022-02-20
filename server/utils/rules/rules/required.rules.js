module.exports = [
    // required 
    {
        msg:(field) => `${field} is required`, 
        rule:(value)=>{
            if(typeof value == 'object'){
                if(Object.values(value).length == 0){
                    return false
                }else{
                    return true
                }
            }else{
                if(!value){
                    return false
                }else{
                    return true
                }   
            }
        },
    }
]