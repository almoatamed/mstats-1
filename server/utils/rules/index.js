const normalizedPath = require("path").join(__dirname, "rules");
const rules_models = {
}

require("fs").readdirSync(normalizedPath).forEach(function(file) {
  let index = file.indexOf('.rules.js')
  if(index != -1){
      rules_models[file.slice(0,index)]= require(`./rules/${file}`)
  }
});



module.exports = async (rules, value,field)=>{
    if(!field){
        field = 'field'
    }
    return new Promise(async (resolve, reject)=>{
        if( typeof rules === 'undefined'){
             resolve({ valid: true, msg: "" })
        }else if (typeof rules === 'string'){
            
            const empty = ! (await rules_models['required'][0].rule(value))
            if( empty && 'required' != rules ){resolve({ valid: true, msg: "" })}


            if(rules in rules_models){
                Object.values(rules_models[rules]).forEach(rule=>{
                    if(!rule.rule(value)){resolve({ valid: false, msg: rule.msg(field) })}
                })
                resolve({ valid: true, msg: "" })
            }else{
                resolve({ valid: true, msg: "" } )
            }
        }else if ( typeof rules === 'object'){
            rules = Object.values(rules)
            
            const empty = ! (await rules_models['required'][0].rule(value))
            if( empty && !rules.includes('required') ){console.log('not required',rules,empty,!rules.includes('required'));resolve({ valid: true, msg: "" })}

            rules.forEach(rule=>{
                if(typeof rule === 'string'){
                    if(rules_models[rule]){
                        Object.values(rules_models[rule]).forEach(sub_rule=>{
                            if(!sub_rule.rule(value)){resolve({ valid: false, msg: sub_rule.msg(field) })}
                        })
                    }else{
                        console.error("Rule Not Fount: ", rule )
                    }
                }else{
                    if(!rule.rule(value)){resolve({ valid: false, msg: rule.msg(field) })}
                }
            })
            resolve({ valid: true, msg: "" })
        }
    })
}

