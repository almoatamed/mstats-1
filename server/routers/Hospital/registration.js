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
    const Hospital_data = request.body;

    //validation
    const validaters = [
      [["required", "title"], Hospital_data.name, "name"],
      [["email"], Hospital_data.email, "email"],
      [["phone"], Hospital_data.phone, "phone"],
      [["address"], Hospital_data.address, "address"],
    ];
    const valid = await mutirules(validaters);
    if (!valid.valid) {
      response
        .status(env.response.status_codes.invalid_field)
        .json({ error: { name: "Invalid Field", msg: valid.msg } })
        .end();
    }

    // verify that MedRep name is unique
    const unique = await uq("hospitals", "name", Hospital_data.name);
    if (!unique) {
      return response
        .status(env.response.status_codes.repeated_query)
        .json({
          error: {
            name: "Hospital Registration Error",
            msg: "This Hospital Name is used",
          },
        })
        .end();
    }

    // insert new Hospital
    const insertion_query = `
               INSERT INTO hospitals(name, email, phone, address, created_by_user) VALUES(
                   '${Hospital_data.name}',
                   '${!!Hospital_data.email ? Hospital_data.email : "null"}',
                   '${!!Hospital_data.phone ? Hospital_data.phone : "null"}',
                   '${
                     !!Hospital_data.address ? Hospital_data.address : "null"
                   }',
                   ${request.user.user_id}
               );
           `;
    await pq(insertion_query);
    response
      .status(env.response.status_codes.ok)
      .json({ result: { msg: "Hospital created" } })
      .end();
  } catch (error) {
    next(error)
  }
});

module.exports = router;
