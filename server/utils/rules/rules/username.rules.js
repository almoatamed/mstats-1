module.exports = [
    // username 
    {
        msg:()=> "Invalid Username", 
        rule:(value)=>{
            try {
                return !!value.match(/^[a-zA-z_][a-zA-z0-9_\-]{3,}$/)            
            } catch {
                return false
            }
        },
    }
]