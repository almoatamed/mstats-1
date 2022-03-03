const express = require("express");
const router = express.Router();
const seeder = require('../../utils/seeder/seeder')
const gen = require("../../utils/generator");
const is_unique = require("../../database/helpers/is_unique.db");
const pq = require("../../database/helpers/promise_query.db");
const rq = require('../../database/helpers/many_to_many_relations.db')


const seed = async () => {

  // generate random name (name, unique)
  let name = await gen.name(2)
  let unique = is_unique('medical_representative', 'name', name)
  while (!unique) {
    name = await gen.name(2)
    unique = is_unique('medical_representative', 'name', name)
  }

  // random address (text word)
  const address = await gen.text(6, 'w')

  // random phone number (phone)
  const phone = await gen.phone()


  // random user id 
  const users_ids = (await pq(`
  select user_id from user where deleted = 0 limit 1000
  `)).map(el => el.user_id)
  const created_by_user = users_ids[Math.floor(Math.random() * users_ids.length)]

  const insertion_query = `
    insert into medical_representative (name, address, phone, created_by_user) values(
      '${name}',
      '${address}',
      '${phone}',
      '${created_by_user}'
    )
  `
  await pq(insertion_query)


  // mock request
  const request = {}
  request.user = {}
  request.user.user_id = created_by_user

  // random manufactorers
  const available_manufacturer_ids = (await pq(`
  select manufacturer_id from manufacturers where deleted = 0 limit 1000
  `)).map(el => el.manufacturer_id)
  const limit = available_manufacturer_ids.length < 10 ? available_manufacturer_ids.length : 10
  for (let i = 0; i < limit; i++) {
    const manufacturer_id = '' + available_manufacturer_ids[Math.floor(Math.random() * available_manufacturer_ids.length)]
    try{
      // relation insertions
      await rq.insert_arr(
        'manufacturer_medical_representative_relations',
        'medical_representative',
        'representative_id',
        'name',
        name,
        'manufacturers',
        'manufacturer_id',
        'manufacturer_id',
        [manufacturer_id],
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
router.get("/factory/:no", factory_middleware);
router.methods = {
  seed, factory_middleware
}
module.exports = router;
