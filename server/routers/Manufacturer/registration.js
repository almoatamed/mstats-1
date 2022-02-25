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

router.post("/", user_middleware.auth, async (request, response) => {
  try {
    const Manufacturer_data = request.body;
    console.log(request.body)

    //validation  
    const validaters = [
      [["required", "title"], Manufacturer_data.name, "name"],
      [["email"], Manufacturer_data.email, "email"],
      [["phone"], Manufacturer_data.phone, "phone"],
      [["address"], Manufacturer_data.address, "address"],
    ];

    const valid = await mutirules(validaters);
    if (!valid.valid) {
      response
        .status(env.response.status_codes.invalid_field)
        .json({ error: { name: "Invalid Field", msg: valid.msg } })
        .end();
    }

    // verify that MedRep name is unique
    const unique = await uq("manufacturers", "name", Manufacturer_data.name);
    if (!unique) {
      return response
        .status(env.response.status_codes.repeated_query)
        .json({
          error: {
            name: "manufacturer Registration Error",
            msg: "This manufacturer Name is used",
          },
        })
        .end();
    }

    // insert new Medical Representative
    const insertion_query = `
               INSERT INTO manufacturers(name, email, phone, address, created_by_user) VALUES(
                   '${Manufacturer_data.name}',
                   '${!!Manufacturer_data.email ? Manufacturer_data.email : "null"}',
                   '${!!Manufacturer_data.phone ? Manufacturer_data.phone : "null"}',
                   '${
                     !!Manufacturer_data.address ? Manufacturer_data.address : "null"
                   }',
                   ${request.user.user_id}
               );
           `;
    await pq(insertion_query);
    response
      .status(env.response.status_codes.ok)
      .json({ result: { msg: "Manufacturer created" } })
      .end();
  } catch (error) {
    if(!response.headersSent){
      return response
        .status(env.response.status_codes.server_error)
        .json({
          error: {
            err: error,
            name: "Manufacturer Registration Error",
            msg: "Error while registring Manufacturer",
          },
        })
        .end();
    }
  }
});

module.exports = router;
