const normalizedPath = __dirname
const generators = {
}

require("fs").readdirSync(normalizedPath).forEach(function(file) {
  let index = file.indexOf('.generator.js')
  if(index != -1){
      generators[file.slice(0,index)]= require(`./${file}`)
  }
});

module.exports = generators