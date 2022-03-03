// router instance
const express = require("express");
const router = express.Router();

// env
const env = require("../../env");

// authenticater
const user_middleware = require("../../middlewares/user.middleware");

// rules
const mutirules = require("../../utils/rules/multirules");

// database pool
const uq = require("../../database/helpers/is_unique.db");
const pq = require("../../database/helpers/promise_query.db");
const eq = require('../../database/helpers/exists.db')
const rq = require('../../database/helpers/many_to_many_relations.db')

router.post("/", user_middleware.auth, async (request, response) => {
  try {
    const MedRep_data = request.body;

    await eq.valdiate_arr('manufacturers','name',MedRep_data.manufacturers)

    //validation
    const validaters = [
      [["required", "name"], MedRep_data.name, "name"],
      [["email"], MedRep_data.email, "email"],
      [["phone"], MedRep_data.phone, "phone"],
      [["address"], MedRep_data.address, "address"],
    ];
    const valid = await mutirules(validaters);
    if (!valid.valid) {
      response
        .status(env.response.status_codes.invalid_field)
        .json({ error: { name: "Invalid Field", msg: valid.msg } })
        .end();
    }

    // verify that MedRep name is unique
    const unique = await uq("medical_representative", "name", MedRep_data.name);
    if (!unique) {
      return response
        .status(env.response.status_codes.repeated_query)
        .json({
          error: {
            name: "Medical Representative Registration Error",
            msg: "This Medical Representative Name is used",
          },
        })
        .end();
    }

    // insert new Medical Representative
    const insertion_query = `
               INSERT INTO medical_representative(name, email, phone, address, created_by_user) VALUES(
                   '${MedRep_data.name}',
                   '${!!MedRep_data.email ? MedRep_data.email : "null"}',
                   '${!!MedRep_data.phone ? MedRep_data.phone : "null"}',
                   '${
                     !!MedRep_data.address ? MedRep_data.address : "null"
                   }',
                   ${request.user.user_id}
               );
           `;
    await pq(insertion_query);


    await rq.insert_arr(
      'manufacturer_medical_representative_relations',
      'medical_representative',
      'representative_id',
      'name',
      MedRep_data.name,
      'manufacturers',
      'manufacturer_id',
      'name',
      MedRep_data.manufacturers,
      request
    )



    response
      .status(env.response.status_codes.ok)
      .json({ result: { msg: "Medical Representative created" } })
      .end();
  } catch (error) {
    if(!response.headersSent){
      return response
        .status(env.response.status_codes.server_error)
        .json({
          error: {
            err: error,
            name: "Medical Representative Registration Error",
            msg: "Error while registring Medical Representative",
          },
        })
        .end();
    }
  }
});

module.exports = router;
