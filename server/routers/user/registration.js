// router instance
const express = require("express");
const router = express.Router();

// env
const env = require("../../env");

// authenticater
const user_middleware = require("../../middlewares/user.middleware");

// rules
const multirules = require("../../utils/rules/multirules");

// database pool
const uq = require("../../database/helpers/is_unique.db");
const pq = require("../../database/helpers/promise_query.db");

// encryption
const bcrypt = require("bcrypt");

router.post("/", user_middleware.auth, async (request, response) => {
  try {
    const user_data = request.body;

    // validation
    const validaters = [
      [["required", "username"], user_data.username, "username"],
      [["required", "password"], user_data.password, "password"],
      [["required", "name"], user_data.name, "name"],
      [["email"], user_data.email, "email"],
      [["phone"], user_data.phone, "phone"],
      [["address"], user_data.address, "address"],
    ];
    const valid = await multirules(validaters);
    if (!valid.valid) {
      return response
        .status(env.response.status_codes.invalid_field)
        .json({ error: { name: "Invalid Field", msg: valid.msg } })
        .end();
    }

    // verify that username is unique
    const unique = await uq("user", "user_name", user_data.username);
    if (!unique) {
      return response.status(env.response.status_codes.repeated_query).json({
        error: {
          name: "user registration error",
          msg: "username used",
        },
      });
    }

    // insert new user
    const hash = await bcrypt.hash(user_data.password, env.auth.bcrypt.rounds);
    const insertion_query = `
      INSERT INTO user(user_name, password, name, email, phone_number, address, created_by_user) VALUES(
          '${user_data.username}',
          '${hash}',
          '${user_data.name}',
          ${!!user_data.email ? "'" + user_data.email + "'" : "null"},
          ${!!user_data.phone ? "'" + user_data.phone + "'" : "null"},
          ${!!user_data.address ? "'" + user_data.address + "'" : "null"},
          ${request.user.user_id}
      );
    `;
    await pq(insertion_query);
    return response
      .status(env.response.status_codes.ok)
      .json({ result: { msg: "user created" } })
      .end();
  } catch (error) {
    console.error(error)
    if (!response.headersSent) {
      return response.status(env.response.status_codes.server_error).json({
        error: {
          err: error,
          name: "user registration error",
          msg: "error while registrign user",
        },
      });
    }
  }
});

module.exports = router;
