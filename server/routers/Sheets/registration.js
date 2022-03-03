const express = require("express");
const router = express.Router();

// env
const env = require("../../env");

// authenticater
const user_middleware = require("../../middlewares/user.middleware");

// rules
const multirules = require("../../utils/rules/multirules");

// db
const pq = require("../../database/helpers/promise_query.db");
const uq = require("../../database/helpers/is_unique.db");
const rq = require('../../database/helpers/many_to_many_relations.db')
const eq = require('../../database/helpers/exists.db')

router.post("/", user_middleware.auth, async (request, response, next) => {
  try {
    const sheet_data = request.body;

    const prescription_id = (await eq.validate_one('prescriptions','name', sheet_data.prescription_name)).prescription_id
    const doctor_id = (await eq.validate_one('doctors','name', sheet_data.doctor_name)).doctor_id

    // validate number of entries
    if(!(sheet_data.entries_number > env.client.sheets.generator_min && sheet_data.entries_number < env.client.sheets.generator_max)){
      throw {error:{msg:"Invalid Number of Entries", name:"Sheet registration Error"}, status_code:env.response.status_codes.invalid_field}
    }

    // insertion 
    for (let i = 0; i < parseInt(sheet_data.entries_number); i++) {
      const insertion_query = `
          INSERT INTO sheets( doctor_id, prescription_id, created_by_user) VALUES(
            '${prescription_id}',
            '${doctor_id}',
            '${request.user.user_id}'
          );
        `
      await pq(insertion_query)
    }

    return response.status(env.response.status_codes.ok).json({result:{msg:'sheet created'}}).end()
  } catch (error) {
    next(error)
  }
});

module.exports = router