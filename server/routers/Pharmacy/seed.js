const express = require("express");
const router = express.Router();
const seeder = require('../../utils/seeder/seeder')
const gen = require("../../utils/generator");
const is_unique = require("../../database/helpers/is_unique.db");
const pq = require("../../database/helpers/promise_query.db");
const rq = require('../../database/helpers/many_to_many_relations.db')


const seed = async () => {

  // name (title, unique)
  let name = await gen.title(2)
  let unique = is_unique('pharmacies', 'name', name)
  while (!unique) {
    name = await gen.title(2)
    unique = is_unique('pharmacies', 'name', name)
  }

  // address (text)
  const address = await gen.text(6,'w')

  // phone
  const phone = await gen.phone()


  // generating username and password for pharmacy
  const username =
    name.replace(" ", "").slice(0, 3) +
    Math.floor(Math.random() * 10) +
    Math.floor(Math.random() * 10) +
    Math.floor(Math.random() * 10);
  const password =
    '' + Math.floor(Math.random() * 10) +
    Math.floor(Math.random() * 10) +
    Math.floor(Math.random() * 10) +
    Math.floor(Math.random() * 10);

  // random user id
  const users_ids = (await pq(`
  select user_id from user where deleted = 0 limit 1000
  `)).map(el => el.user_id)
  const created_by_user = users_ids[Math.floor(Math.random() * users_ids.length)]

  // insertion query 
  const insertion_query = `
    insert into pharmacies (name, address, phone, username, password, created_by_user) values(
      '${name}',
      '${address}',
      '${phone}',
      '${username}',
      '${password}',
      '${created_by_user}'
    )
  `
  await pq(insertion_query)

  // one random hospital relation
  const hospitals_ids = (await pq(`
  select hospital_id from hospitals where deleted = 0 limit 1000
  `)).map(el => el.hospital_id)
  const hospital_id = '' + hospitals_ids[Math.floor(Math.random() * hospitals_ids.length)]

  // mok request user
  const request = {}
  request.user = {}
  request.user.user_id = created_by_user

  // relation insertion
  await rq.insert_arr(
    'pharmacy_hospital_relations',
    'pharmacies',
    'pharmacy_id',
    'name',
    name,
    'hospitals',
    'hospital_id',
    'hospital_id',
    [hospital_id],
    request
  )

}

const factory_middleware = seeder(seed)
router.get("/factory/:no",factory_middleware);
router.methods = {
  seed,factory_middleware
}
module.exports = router;
