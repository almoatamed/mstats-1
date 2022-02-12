module.exports = [
    // name
    {
        rule:(value)=>{
            try {
                return !!value.trim().match(/^(?:[a-zA-Z]{3,20})(?:\s{1,2}[a-zA-Z]{1,20}){1,3}$/)            
            } catch {
                return false
            }
        },
        msg: ()=>"Invalid Name"
    },
]