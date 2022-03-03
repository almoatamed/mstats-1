const express = require("express");
const router = express.Router();
const seeder = require('../../utils/seeder/seeder')
const gen = require("../../utils/generator");
const is_unique = require("../../database/helpers/is_unique.db");
const pq = require("../../database/helpers/promise_query.db");


const seed = async () => {
  console.log('seeding hospitals')

  // name (title, unique)
  let name = await gen.title(2)
  let unique = is_unique('hospitals', 'name', name)
  while (!unique) {
    name = await gen.title(2)
    unique = is_unique('hospitals', 'name', name)
  }

  // address (text)
  const address = await gen.text(6,'w')

  // phone
  const phone = await gen.phone()

  // random user id
  const users_ids = (await pq(`
  select user_id from user where deleted = 0 limit 1000
  `)).map(el => el.user_id)
  const created_by_user = users_ids[Math.floor(Math.random() * users_ids.length)]

  // insertion query 
  const insertion_query = `
    insert into hospitals (name, address, phone, created_by_user) values(
      '${name}',
      '${address}',
      '${phone}',
      '${created_by_user}'
    )
  `

  await pq(insertion_query)
}

const factory_middleware = seeder(seed)
router.get("/factory/:no",factory_middleware);
router.methods = {
  seed,factory_middleware
}
module.exports = router;
