module.exports = [
    {
        msg:(field)=>{return `${field} is not valid title`},
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