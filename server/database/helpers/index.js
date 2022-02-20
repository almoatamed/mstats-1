const normalizedPath = __dirname
const database_helpers = {
}
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  let index = file.indexOf('.db.js')
  if(index != -1){
      database_helpers[file.slice(0,index)]= require(`./${file}`)
  }
});

module.exports = database_helpers