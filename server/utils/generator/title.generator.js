const uname = require('unique-names-generator')

const config = {separator:' ', style:'capital', length:'2', dictionaries:[
    uname.names,uname.colors
]}


module.exports = function (n) {
    try {
        let no = parseInt(n) 
        if(no > 0) config.length = no;
    } catch (error) {
        console.log(error)
    }
    return uname.uniqueNamesGenerator(config)
}