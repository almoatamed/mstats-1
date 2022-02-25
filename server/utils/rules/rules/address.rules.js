module.exports = [
    {
        msg:(field)=>{return `${field} is not valid address`},
        rule:(value)=>{
            if(typeof value != 'string'){
                return false
            }
            if(value.length > 250){
                return false
            }
            return true
        }
    }
]