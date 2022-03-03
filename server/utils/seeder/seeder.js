const env = require('../../env')

module.exports = (seed_method)=>async(req,res,next)=>{
  try {
    // log
    console.log(
      "generating, req.query",
      req.query,
      " req.params",
      req.params
    );

    // auth
    if (req.query.key != env.auth.seed_key) {
      throw { error: { name: "not authorized", msg: "please provide seed key" },status_code:env.response.status_codes.not_autharized}
    }
  
    // Number of entries
    let number_of_entries = 0;
    number_of_entries = parseInt(req.params.no);
    if (!(number_of_entries >0)) {
      throw {error:{ name: "factory error", msg: "not defined factory number" },status_code:env.response.status_codes.invalid_field};
    }

    // generate
    for (let i = 0; i < number_of_entries; i++) {
      await seed_method()
    }
    
    // done
    console.log("done");
    if(req.baseUrl != '/server/api/factory'){
      return res
      .status(env.response.status_codes.ok)
      .json({
        result: {
          name: "succeed",
          msg: `created ${number_of_entries} mock`,
        },
      });
    }else{
      next()
    }
      
  } catch (error) {
      next(error)
  }
}