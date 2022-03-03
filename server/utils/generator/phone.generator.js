const no_gen = require('./number.generator')
const phone_keys = [
    '091','0021891',
    '092','0021892',
    '094','0021894',
    '021','0021821',
]

module.exports = ()=>{
    return '' + phone_keys[Math.floor(Math.random()*phone_keys.length)]+ no_gen(7)
}