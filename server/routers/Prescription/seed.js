const express = require("express");
const router = express.Router();
const seeder = require('../../utils/seeder/seeder')
const gen = require("../../utils/generator");
const is_unique = require("../../database/helpers/is_unique.db");
const pq = require("../../database/helpers/promise_query.db");
const rq = require('../../database/helpers/many_to_many_relations.db')


const seed = async () => {

  // name (name, unique)
  let name = await gen.title(2)
  let unique = is_unique('prescriptions', 'name', name)
  while (!unique) {
    name = await gen.title(2)
    unique = is_unique('prescriptions', 'name', name)
  }


  // random user id
  const users_ids = (await pq(`
  select user_id from user where deleted = 0 limit 1000
  `)).map(el => el.user_id)
  const created_by_user = users_ids[Math.floor(Math.random() * users_ids.length)]

  // insertion query 
  const insertion_query = `
    insert into prescriptions (name, created_by_user) values(
      '${name}',
      '${created_by_user}'
    )
  `
  await pq(insertion_query)

  // mok request user
  const request = {}
  request.user = {}
  request.user.user_id = created_by_user

  // random products
  const available_product_ids = (await pq(`
  select product_id from products where deleted = 0 limit 1000
  `)).map(el => el.product_id)
  const rand_limit = Math.ceil(Math.random()*30) || 1
  const limit = available_product_ids.length < rand_limit ? available_product_ids.length : rand_limit
  for (let i = 0; i < limit; i++) {
    const product_id = '' + available_product_ids[Math.floor(Math.random() * available_product_ids.length)]
    try{
      // relation insertion
      await rq.insert_arr(
        'prescription_product_relations',
        'prescriptions',
        'prescription_id',
        'name',
        name,
        'products',
        'product_id',
        'product_id',
        [product_id],
        request
      )
    }catch (error){
      if(error?.status_code == 406){
        i--
      }else{
       throw error
      }
    }
  }


}

const factory_middleware = seeder(seed)
router.get("/factory/:no",factory_middleware);
router.methods = {
  seed,factory_middleware
}
module.exports = router;
