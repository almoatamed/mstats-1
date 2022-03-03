const express = require("express");
const env = require("../../env");
const mysql = require("../../database/mydql");
const router = express.Router();
const bcrypt = require("bcrypt");
const gen = require("../../utils/generator");
const is_unique = require("../../database/helpers/is_unique.db");
const pq = require("../../database/helpers/promise_query.db");

router.get("/", (req, res) => {
  console.log(req.originalUrl, req.url, req.baseUrl, req.hostname, req.complete, req.path, req.protocol)
  if (req.query.key != env.auth.seed_key) {
    return res
      .status(env.response.status_codes.not_autharized)
      .json({
        error: { name: "not authorized", msg: "please provide seed key" },
      });
  }
  mysql.pool.getConnection((err, connection) => {
    if (err) {
      return res
        .status(env.response.status_codes.server_error)
        .json({ error: { err, msg: "Error in database connection" } })
        .end();
    }
    const sql_query = `
            SELECT * FROM user WHERE user_name = 'admin' and name = 'admin' AND deleted = 0 limit 1;
        `;
    connection.query(sql_query, async (err, result) => {
      if (err) {
        connection.release();
        return res
          .status(env.response.status_codes.server_error)
          .json({ error: { err, msg: "Error in database connection" } })
          .end();
      }

      if (result.length == 0) {
        const hash = await bcrypt.hash("admin", env.auth.bcrypt.rounds);
        const seed_query = `
                    INSERT INTO user(name, user_name, password, created_by_user) VALUES(
                        'admin', 
                        'admin', 
                        '${hash}',
                        1
                    );
                `;
        connection.query(seed_query, (err, result) => {
          connection.release();
          if (err) {
            return res
              .status(env.response.status_codes.server_error)
              .json({ error: { err, msg: "Error in seeding" } })
              .end();
          } else {
            return res
              .status(env.response.status_codes.ok)
              .json({ result: { msg: "defaul user created" } })
              .end();
          }
        });
      } else {
        connection.release();
        return res
          .status(env.response.status_codes.repeated_query)
          .json({
            error: { name: "seed error", message: "already seeded" },
          })
          .end();
      }
    });
  });
});

const factory_middleware = async (req, res,next) => {
  console.log(req.originalUrl, req.url, req.baseUrl, req.hostname)
  console.log(
    "generating users, req.query",
    req.query,
    " req.params",
    req.params
  );
  let number_of_entries = 0;
  if (req.query.key != env.auth.seed_key) {
    return res
      .status(env.response.status_codes.not_autharized)
      .json({
        error: { name: "not authorized", msg: "please provide seed key" },
      });
  }
  try {
    number_of_entries = parseInt(req.params.no);
    if (!(number_of_entries > 0)) {
      throw { name: "factory error", msg: "not defined factory number" };
    }
  } catch (error) {
    return res
      .status(env.response.status_codes.invalid_field)
      .json({
        error: {
          err: error,
          message: "Invalid number of factory",
          name: "factory error",
        },
      })
      .end();
  }

  try {
    let password = "1234";
    const hash = await bcrypt.hash(password, env.auth.bcrypt.rounds);
    for (let index = 0; index < number_of_entries; index++) {
      let name = gen.name(2);
      let phone_number = gen.phone();
      let address = gen.text(6, 'w');
      let username = gen.username(name);
      while (!is_unique("user", "user_name", username)) {
        username = gen.username(name);
      }

      let insert_query = `
                    INSERT INTO user (name, user_name, password, address, phone_number, created_by_user) VALUES(
                        '${name}', '${username}', '${hash}', '${address}', '${phone_number}', 1
                    );
                `;
      await pq(insert_query);
    }
    console.log("done");
    if (req.baseUrl != '/server/api/factory') {
      return res
        .status(env.response.status_codes.ok)
        .json({
          result: {
            name: "succeed",
            msg: `created ${number_of_entries} mock user`,
          },
        });
    } else {
      return next()
    }
  } catch (error) {
    return res
      .status(env.response.status_codes.server_error)
      .json({
        error: { err: error, message: "server error", name: "factory error" },
      })
      .end();
  }
}

router.get("/factory/:no", factory_middleware);
router.methods = {
  factory_middleware
}
module.exports = router;
