const express = require("express");
const router = express.Router();
const seeder = require('../../utils/seeder/seeder')
const gen = require("../../utils/generator");
const is_unique = require("../../database/helpers/is_unique.db");
const pq = require("../../database/helpers/promise_query.db");


const seed = async ()=>{

  // random name (title, unique)
  let name = await gen.title(2)
  let unique = is_unique('products','name',name)
  while(!unique){
    name = await gen.title(2)
    unique = is_unique('products','name',name)
  }

  // random description (text paragraph)
  const description =  await gen.text(1)

  // random manufacturer id 
  const manufacturers_ids = (await pq(`
  select manufacturer_id from manufacturers where deleted = 0 limit 1000
  `)).map(el => el.manufacturer_id)
  const manufacturer_id = manufacturers_ids[Math.floor(Math.random() * manufacturers_ids.length)]
  
  // random user id
  const users_ids = (await pq(`
  select user_id from user where deleted = 0 limit 1000
  `)).map(el => el.user_id)
  const created_by_user = users_ids[Math.floor(Math.random() * users_ids.length)]

  // insertion query
  const query = `
    insert into products (name, description, manufacturer_id, created_by_user) values(
      '${name}',
      '${description}',
      '${manufacturer_id}',
      '${created_by_user}'
    )
  ` 
  await pq(query)
}
const factory_middleware = seeder(seed)



router.get("/factory/:no",factory_middleware);
router.methods = {
  seed,factory_middleware
}
module.exports = router;
