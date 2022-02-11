module.exports = [
    // username 
    (value)=>{
        try {
            return !!value.match(/^[a-zA-z0-9_\-\!\@\#\$\%\^\&\*\(\)\+\<\>\.\?\,\;\|]{4,20}$/)            
        } catch {
            return false
        }
    },
]