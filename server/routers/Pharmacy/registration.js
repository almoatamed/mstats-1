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
    const pharmacy_data = request.body;

    // validation
    const validaters = [
      [["required",'title'], pharmacy_data.name, "name"],
      [["address"], pharmacy_data.address, "address"],
      [["phone"], pharmacy_data.phone, "phone"],
      [["email"], pharmacy_data.email, "email"],
    ];
    valid = await multirules(validaters)
    if(!valid.valid){
      return response.status(env.response.status_codes.invalid_field).json({ error: { name: "Invalid Field", msg: valid.msg } }).end();
    }


    // validating unique
    const is_unique = await uq("pharmacies", "name", pharmacy_data.name);
    console.log(is_unique)
    if (!is_unique) {
      return response
        .status(env.response.status_codes.repeated_query)
        .json({
          error: {
            name: "Pharmacy Registration Error",
            msg: "This Pharmacy Name is used",
          },
        })
        .end();
    }

    // generating username and password for pharmacy
    pharmacy_data.username =
      pharmacy_data.name.replace(" ", "").slice(0, 3) +
      Math.floor(Math.random() * 10) +
      Math.floor(Math.random() * 10) +
      Math.floor(Math.random() * 10);
    pharmacy_data.password =
      ''+Math.floor(Math.random() * 10) +
      Math.floor(Math.random() * 10) +
      Math.floor(Math.random() * 10) +
      Math.floor(Math.random() * 10);

    // insertion 
    const insertion_query = `
        INSERT INTO pharmacies( name, email, phone, address, username, password, created_by_user) VALUES(
          '${pharmacy_data.name}',
          ${!!pharmacy_data.email ? "'" + pharmacy_data.email + "'" : "null"},
          ${!!pharmacy_data.phone ? "'" + pharmacy_data.phone + "'" : "null"},
          ${!!pharmacy_data.address ? "'" + pharmacy_data.address + "'" : "null"},
          '${pharmacy_data.username}',
          '${pharmacy_data.password}',
          ${request.user.user_id}
        );
      `;
    await pq(insertion_query);
    return response
      .status(env.response.status_codes.ok)
      .json({ result: { msg: "pharmacy created" } })
      .end();
  } catch (error) {
    if(!response.headersSent){
      return response
      .status(env.response.status_codes.server_error)
      .json({
        error: {
          err: error,
          name: "Pharmacy Registration Error",
          msg: "Error while registring pharmacy",
        },
      })
      .end();
    }
  }
});

module.exports = router