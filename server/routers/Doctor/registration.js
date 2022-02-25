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
    const doctor_data = request.body;

    await eq.valdiate_arr('medical_representative','name',doctor_data.docMedreps)
    await eq.valdiate_arr('hospitals','name',doctor_data.docHospitals)

    // validation
    const validaters = [
      [["required", "name"], doctor_data.name, "name"],
      [["required", "title"], doctor_data.speciality, "speciality"],
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
        INSERT INTO doctors( name, email, speciality, phone, address, created_by_user) VALUES(
          '${doctor_data.name}',
          ${!!doctor_data.email ? "'" + doctor_data.email + "'" : "null"},
          ${!!doctor_data.speciality ? "'" + doctor_data.speciality + "'" : "null"},
          ${!!doctor_data.phone ? "'" + doctor_data.phone + "'" : "null"},
          ${!!doctor_data.address ? "'" + doctor_data.address + "'" : "null"},
          ${request.user.user_id}
        );
      `
    await pq(insertion_query)
    await rq.insert_arr(
      'doctor_medical_representative_relations',
      'doctors',
      'doctor_id',
      'name',
      doctor_data.name,
      'medical_representative',
      'representative_id',
      'name',
      doctor_data.docMedreps,
      request
    )
    await rq.insert_arr(
      'doctor_hospital_relations',
      'doctors',
      'doctor_id',
      'name',
      doctor_data.name,
      'hospitals',
      'hospital_id',
      'name',
      doctor_data.docHospitals,
      request
    )


    return response.status(env.response.status_codes.ok).json({result:{msg:'doctor created'}}).end()
  } catch (error) {
    next(error)
  }
});

module.exports = router