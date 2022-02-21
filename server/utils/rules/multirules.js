
// rules 
const rules   = require('./index')
module.exports = async (validaters)=>{
    return new Promise(async(resolve)=>{
        for (const  validater of validaters) {
            const valid =  await rules(validater[0], validater[1], validater[2])
            if(!valid.valid){
                return resolve(valid)
            }
        }
        return resolve({ valid: true, msg: "" })
    })
}
