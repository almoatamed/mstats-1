const fs = require("fs");
const pq = require('../../database/helpers/promise_query.db')

const rm_one = async (file) => {
  return new Promise(async(resolve, reject) => {
    try {
      if(typeof file == 'number'){
        // find
        const find_query = `
          select path from files where file_id = ${file};
        `
        let file_path = await pq(find_query)
        if(file_path.length == 0){throw {error:{msg:'Invalid file', file, name:"File removal error"}}}
        file_path = file_path[0].path

        // delete 
        const delete_query = `
          update files set deleted = 0 where file_id = ${file}
        `
        await pq(delete_query)
        fs.rm(file_path, (err,res)=>{
          if(err){throw err}
          resolve()
        })
      }else if(typeof file == 'string'){
        // find
        const find_query = `
          select file_id from files where path = '${file}'
        `
        let file_path = await pq(find_query)
        if(file_path.length == 0){throw {error:{msg:'Invalid file', file, name:"File removal error"}}}

        // delete
        const delete_query = `
          update files set deleted = 1 where path = '${file}'
        `        
        await pq(delete_query)
        fs.rm(file, (err,res)=>{
          if(err){throw err}
          resolve()
        })
      }else{
        if(file_path.length == 0){throw {error:{msg:'Invalid file', file, name:"File removal error"}}}
      }
    } catch (error) {
      reject(error)
    }
  });
};
module.exports ={

one: rm_one,

array:async(request)=>{
  return new Promise(async(resolve,reject)=>{
    if(request.isFile){
      for(file of request.saved_files){
        try {
          await rm_one(file.path)
        } catch (error) {
          console.log(error.message )
        }
      }
      resolve()
    }else{
      resolve()
    }
  })
}
}