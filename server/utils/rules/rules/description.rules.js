module.exports = [
    {
        msg:(field)=>{return `${field} is not valid address`},
        rule:(value)=>{
            if(typeof value != 'string'){
                return false
            }
            if(value.length > 500){
                return false
            }
            return true
        }
    }
]