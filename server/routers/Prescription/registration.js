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
    const prescription_data = request.body;

    await eq.valdiate_arr('products','name',prescription_data.products)
    

    // validation
    const validaters = [
      [["required", "name"], prescription_data.name, "name"],
    ];
    const valid = await multirules(validaters)
    if(!valid.valid){
      return response
      .status(env.response.status_codes.invalid_field)
      .json({ error: { name: "Invalid Field", msg: valid.msg } })
      .end();
    }

    // validating unique
    const is_unique = await uq("prescriptions", "name", prescription_data.name);
    if (!is_unique) {
      return response
        .status(env.response.status_codes.repeated_query)
        .json({
          error: {
            name: "Prescription Registration Error",
            msg: "This Prescription Name is used",
          },
        })
        .end();
    }

    // insertion 
    const insertion_query = `
        INSERT INTO prescriptions( name, created_by_user) VALUES(
          '${prescription_data.name}',
          '${request.user.user_id}'
        );
      `
    await pq(insertion_query)

    // register relations 
    await rq.insert_arr(
      'prescription_product_relations',
      'prescriptions',
      'prescriptions_id',
      'name',
      prescription_data.name,
      'products',
      'product_id',
      'name',
      prescription_data.products,
      request
    )

    return response.status(env.response.status_codes.ok).json({result:{msg:'doctor created'}}).end()
  } catch (error) {
    next(error)
  }
});

module.exports = router