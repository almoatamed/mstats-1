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

router.post("/", user_middleware.auth, async (request, response) => {
  try {
    const doctor_data = request.body;

    // validation
    const validaters = [
      [["required", "name"], doctor_data.name, "name"],
      [["address"], doctor_data.address, "address"],
      [["phone"], doctor_data.phone, "phone"],
      [["email"], doctor_data.email, "email"],
    ];
    const valid = await multirules(validaters)
    if(!valid.valid){
      return response
      .status(env.response.status_codes.invalid_field)
      .json({ error: { name: "Invalid Field", msg: valid.msg } })
      .end();
    }

    // validating unique
    const is_unique = await uq("doctors", "name", doctor_data.name);
    if (!is_unique) {
      return response
        .status(env.response.status_codes.repeated_query)
        .json({
          error: {
            name: "Doctor Registration Error",
            msg: "This Doctor Name is used",
          },
        })
        .end();
    }


    const insertion_query = `
        INSERT INTO doctors( name, email, phone, address, created_by_user) VALUES(
          '${doctor_data.name}',
          ${!!doctor_data.email ? "'" + doctor_data.email + "'" : "null"},
          ${!!doctor_data.phone ? "'" + doctor_data.phone + "'" : "null"},
          ${!!doctor_data.address ? "'" + doctor_data.address + "'" : "null"},
          ${request.user.user_id}
        );
      `
    await pq(insertion_query)
    return response.status(env.response.status_codes.ok).json({result:{msg:'doctor created'}}).end()
  } catch (error) {
    if(!response.headersSent){
      return response
        .status(env.response.status_codes.server_error)
        .json({
          error: {
            err: error,
            name: "Doctor Registration Error",
            msg: "Error while registring Doctor",
          },
        })
        .end();
    }
  }
});

module.exports = router