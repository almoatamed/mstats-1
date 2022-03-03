const express = require("express");
const router = express.Router();
const seeder = require('../../utils/seeder/seeder')
const gen = require("../../utils/generator");
const is_unique = require("../../database/helpers/is_unique.db");
const pq = require("../../database/helpers/promise_query.db");
const rq = require('../../database/helpers/many_to_many_relations.db')


const seed = async () => {

  // name (name, unique)
  let name = await gen.name(2)
  let unique = is_unique('pharmacies', 'name', name)
  while (!unique) {
    name = await gen.name(2)
    unique = is_unique('pharmacies', 'name', name)
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
    insert into doctors (name, address, phone, created_by_user) values(
      '${name}',
      '${address}',
      '${phone}',
      '${created_by_user}'
    )
  `
  await pq(insertion_query)

  // mok request user
  const request = {}
  request.user = {}
  request.user.user_id = created_by_user

  // random hospitals
  const available_hospital_ids = (await pq(`
  select hospital_id from hospitals where deleted = 0 limit 1000
  `)).map(el => el.hospital_id)
  const limit = available_hospital_ids.length < 4 ? available_hospital_ids.length : 4
  for (let i = 0; i < limit; i++) {
    const hospital_id = '' + available_hospital_ids[Math.floor(Math.random() * available_hospital_ids.length)]
    try{
      // relation insertion
      await rq.insert_arr(
        'doctor_hospital_relations',
        'doctors',
        'doctor_id',
        'name',
        name,
        'hospitals',
        'hospital_id',
        'hospital_id',
        [hospital_id],
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

  // random medreps
  const available_medical_representative_ids = (await pq(`
  select representative_id from medical_representative where deleted = 0 limit 1000
  `)).map(el => el.representative_id)
  const limit2 = available_medical_representative_ids.length < 4 ? available_medical_representative_ids.length : 4
  for (let i = 0; i < limit2; i++) {
    const representative_id = '' + available_medical_representative_ids[Math.floor(Math.random() * available_medical_representative_ids.length)]
    try  {
      // relation insertion
      await rq.insert_arr(
        'doctor_medical_representative_relations',
        'doctors',
        'doctor_id',
        'name',
        name,
        'medical_representative',
        'representative_id',
        'representative_id',
        [representative_id],
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
