const express = require("express");
const router = express.Router();
const seeder = require('../../utils/seeder/seeder')
const gen = require("../../utils/generator");
const is_unique = require("../../database/helpers/is_unique.db");
const pq = require("../../database/helpers/promise_query.db");
const rq = require('../../database/helpers/many_to_many_relations.db')


const seed = async () => {

  const doctors_ids = (await pq(`
  select doctor_id from doctors where deleted = 0 limit 1000
  `)).map(el => el.doctor_id)
  const doctor_id = '' + doctors_ids[Math.floor(Math.random() * doctors_ids.length)]
  if((await pq(`select * from sheets where doctor_id = '${doctor_id}' limit 1 `))[0]){
    return
  }
  
  const prescriptions_ids = (await pq(`
  select prescription_id from prescriptions where deleted = 0 limit 1000
  `)).map(el => el.prescription_id)
  const prescription_id = '' + prescriptions_ids[Math.floor(Math.random() * prescriptions_ids.length)]
  
  const users_ids = (await pq(`
  select user_id from user where deleted = 0 limit 1000
  `)).map(el => el.user_id)
  const created_by_user = users_ids[Math.floor(Math.random() * users_ids.length)]

  const entried_number = Math.ceil(Math.random()*100)

  for (let i = 0; i < entried_number; i++) {
    const printed = Math.floor(Math.random()*2)
    const used =  printed ? Math.floor(Math.random()*2) : 0
    const query = `
      insert into sheets(doctor_id,  prescription_id,status,printed, created_by_user) values(
        '${doctor_id}',
        '${prescription_id}',
        '${used}',
        '${printed}',
        '${created_by_user}'
      )
    `
    await pq(query)
  }
}

const factory_middleware = seeder(seed)
router.get("/factory/:no",factory_middleware);
router.methods = {
  seed,factory_middleware
}
module.exports = router;
