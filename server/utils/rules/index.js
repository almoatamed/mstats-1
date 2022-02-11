

rules_models = {
    username: require('./rules/username.rules.js'),
    password: require('./rules/password.rules.js')
}

module.exports = async (rules, value)=>{
    if( rules === 'undefined'){
        return true
    }else if (typeof rules === 'string'){
        if(rules in rules_models){
            await Object.values(rules_models[rules]).forEach(rule=>{
                if(!rule(value)){return false}
            })
            return true
        }else{
            return true 
        }
    }else if ( typeof rules === 'object'){
        await Object.values(rules).forEach(rule=>{
            if(!rule(value)){return false}
        })
        return true
    }
}

