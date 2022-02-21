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
             return resolve({ valid: true, msg: "" })
        }else if (typeof rules === 'string'){
            
            const empty = ! (rules_models['required'][0].rule(value))
            if( empty && 'required' != rules ){return resolve({ valid: true, msg: "" })}


            if(rules in rules_models){
                const rules = Object.values(rules_models[rules])
                for(rule of rules){
                    console.log('validating rules', rules)
                    if(!rule.rule(value)){return resolve({ valid: false, msg: rule.msg(field) })}
                }
                return resolve({ valid: true, msg: "" })
            }else{
                return resolve({ valid: true, msg: "" } )
            }
        }else if ( typeof rules === 'object'){
            rules = Object.values(rules)
            
            const empty = ! (rules_models['required'][0].rule(value))
            if( empty && ! rules.includes('required') ){return resolve({ valid: true, msg: "" })}

            for(rule of rules){
                if(typeof rule === 'string'){
                    if(rules_models[rule]){
                        const sub_rules = Object.values(rules_models[rule])
                        for(sub_rule of sub_rules){
                            if(!sub_rule.rule(value)){return resolve({ valid: false, msg: sub_rule.msg(field) })}
                        }
                    }else{
                        console.error("Rule Not Fount: ", rule )
                    }
                }else{
                    if(!rule.rule(value)){return resolve({ valid: false, msg: rule.msg(field) })}
                }
            }
            return resolve({ valid: true, msg: "" })
        }
    })
}

