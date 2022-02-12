module.exports = [
    // phone
    {
        rule:(value)=>{
            try {
                return !!value.trim().match(/^((\+|00)\s?\d{1,3}\s?)?(\(?\d{2,3}\)?)(\-|\s)?(\d{3}(\-|\s)?\d{4})$/)            
            } catch {
                return false
            }
        },
        msg: ()=>"Invalid Phone Number"
    },
]