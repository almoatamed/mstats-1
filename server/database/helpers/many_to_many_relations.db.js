const env = require("./../../env");
const pq = require("./promise_query.db");
const pg = require("./paginate.db");

// insertion
const validate_insertion = async (
  relation_table,
  first_table,
  first_field,
  first_value_field,
  first_value,
  second_table,
  second_field,
  second_value_field,
  second_value
) => {
  for (const el of Object.entries({
    relation_table,
    first_table,
    first_field,
    first_value_field,
    first_value,
    second_table,
    second_field,
    second_value_field,
    second_value,
  })) {
    console.log(el)
    if (typeof el[1] != "string") {
      throw {
        error: { msg: `invalid field`, name: "Relation Creation Error" },
        status_code: env.response.status_codes.invalid_field,
      };
    }
  }

  let first = {
    field: first_field,
    value_field: first_value_field,
    value: first_value,
    table: first_table,
  };

  let second = {
    field: second_field,
    value_field: second_value_field,
    value: second_value,
    table: second_table,
  };

  let first_r = (
    await pq(
      `select ${first.field} from ${first.table} where ${first.value_field} = '${first.value}' and deleted = 0 limit 1`
    )
  )[0];
  console.log("first_r", first_r);
  if (!first_r?.[first.field]) {
    throw {
      error: { msg: `${first.table} ${first.value} not found` },
      status_code: env.response.status_codes.invalid_field,
    };
  }

  let second_r = (
    await pq(
      `select ${second.field} from ${second.table} where ${second.value_field} = '${second.value}' and deleted = 0 limit 1`
    )
  )[0];
  if (!second_r?.[second.field]) {
    throw {
      error: { msg: `${second.table} ${second.value} not found` },
      status_code: env.response.status_codes.invalid_field,
    };
  }

  const relation_r = (
    await pq(`
        select * from ${relation_table}
        where 
            ${first.field} = '${first_r?.[first?.field]}' and
            ${second.field} = '${second_r?.[second?.field]}' and 
            deleted = 0;
    `)
  )[0];
  if (relation_r) {
    throw {
      error: { msg: `relation exists` },
      status_code: env.response.status_codes.repeated_query,
    };
  }

  return { first_r, first, second_r, second };
};
const insert_relation = async (
  relation_table,
  first_table,
  first_field,
  first_value_field,
  first_value,
  second_table,
  second_field,
  second_value_field,
  second_value,
  req
) => {
  const parties_r = await validate_insertion(
    relation_table,
    first_table,
    first_field,
    first_value_field,
    first_value,
    second_table,
    second_field,
    second_value_field,
    second_value
  );
  console.log(parties_r)
  const query = `
        insert into ${relation_table} (${parties_r.first.field},${
    parties_r.second.field
  }, created_by_user) values(
            '${parties_r.first_r[parties_r.first.field]}',
            '${parties_r.second_r[parties_r.second.field]}',
            '${req.user.user_id}'
        )
    `;
  console.log(query)
  await pq(query);
};

// get
const validate_get = async (
  relation_table,
  first_table,
  first_field,
  first_value_field,
  first_value,
  second_table,
  second_field,
  second_select_fields
) => {
  console.log('starting')
  for (const el of Object.entries({
    relation_table,
    first_table,
    first_field,
    first_value_field,
    first_value,
    second_table,
    second_field,
  })) {
    if (typeof el[1] != "string") {
      throw {
        error: { msg: `invalid field`, name: "Relation Creation Error" },
        status_code: env.response.status_codes.invalid_field,
      };
    }
  }

  let first = {
    field: first_field,
    value_field: first_value_field,
    value: first_value,
    table: first_table,
  };

  let selected_fields = ["*"];
  if (Array.isArray(second_select_fields) && !!second_select_fields?.length) {
    selected_fields = second_select_fields;
  }

  let second = {
    field: second_field,
    table: second_table,
    selected_fields,
  };
  console.log(first,second)
  console.log(`
    select ${first.field} from
    ${first.table} 
    where 
        ${first.value_field} = '${first.value}' and
        deleted = 0 limit 1
`);
  let first_r = (
    await pq(`
        select ${first.field} from
        ${first.table} 
        where 
            ${first.value_field} = '${first.value}' and
            deleted = 0 limit 1
    `)
  )[0];
  console.log(first_r);
  if (!first_r?.[first.field]) {
    console.log("throwing");
    throw {
      error: { msg: `${first.table} ${first.value} not found` },
      status_code: env.response.status_codes.invalid_field,
    };
  }

  return { first_r, first, second };
};
const get_query = async (
  relation_table,
  first_table,
  first_field,
  first_value_field,
  first_value,
  second_table,
  second_field,
  second_select_fields
) => {
  const parties_r = await validate_get(
    relation_table,
    first_table,
    first_field,
    first_value_field,
    first_value,
    second_table,
    second_field,
    second_select_fields
  );
  console.log(parties_r);
  const query = `
        select ${parties_r.second.selected_fields
          .map((el) => "s." + el)
          .join(", ")} from 
        ${parties_r.second.table} s inner join 
        (
            select r.${parties_r.second.field} as id from 
            ${relation_table} r where 
            r.${parties_r.first.field} = '${
    parties_r.first_r[parties_r.first.field]
  }'
        ) sr_ids
        on 
        sr_ids.id = s.${parties_r.second.field}
    `;
  console.log("the great query", query);
  // console.log(query)
  return query;
};
const get = async (
  relation_table,
  first_table,
  first_field,
  first_value_field,
  first_value,
  second_table,
  second_field,
  second_select_fields = [],
  n_per_page = -1,
  page = 1
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = await get_query(
        relation_table,
        first_table,
        first_field,
        first_value_field,
        first_value,
        second_table,
        second_field,
        second_select_fields
      );
      console.log("query", query);
      return pg(query, n_per_page, page)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
};
// get ids
const get_ids_query = async (
  relation_table,
  first_table,
  first_field,
  first_value_field,
  first_value,
  second_field
) => {
  const parties_r = await validate_get(
    relation_table,
    first_table,
    first_field,
    first_value_field,
    first_value,
    "",
    second_field,
    []
  );
  // console.log(parties_r)
  const query = `
        select r.${parties_r.second.field} as id from 
        ${relation_table} r where 
        ${parties_r.first.field} = ${parties_r.first_r[parties_r.first.field]} 
    `;
  // console.log(query)
  return query;
};
const get_ids = async (
  relation_table,
  first_table,
  first_field,
  first_value_field,
  first_value,
  second_field,
  n_per_page = -1,
  page = 1
) => {
  // console.log('getting ids for relation')
  return new Promise(async (resolve, reject) => {
    try {
      const query = await get_ids_query(
        relation_table,
        first_table,
        first_field,
        first_value_field,
        first_value,
        second_field
      );
      // console.log(query)
      pg(query, n_per_page, page)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
};

const validate_insertions = async (
  relation_table,
  first_table,
  first_field,
  first_value_field,
  first_values,
  second_table,
  second_field,
  second_value_field,
  second_values
) => {
  if (!second_values?.length) {
    return;
  }
  if (
    second_values?.length != first_values?.length &&
    Array.isArray(first_values)
  ) {
    throw {
      error: { msg: "Invalid Field" },
      status_code: env.response.status_codes,
    };
  }
  for (let i = 0; i < second_values.length; i++) {
    await validate_insertion(
      relation_table,
      first_table,
      first_field,
      first_value_field,
      typeof first_values == "string" ? first_values : first_values[i],
      second_table,
      second_field,
      second_value_field,
      second_values[i]
    );
  }
};

const insert_arr = async (
  relation_table,
  first_table,
  first_field,
  first_value_field,
  first_values,
  second_table,
  second_field,
  second_value_field,
  second_values,
  req
) => {
  if (!second_values?.length || !Array.isArray(second_values)) {
    return;
  }
  await validate_insertions(
    relation_table,
    first_table,
    first_field,
    first_value_field,
    first_values,
    second_table,
    second_field,
    second_value_field,
    second_values
  );
  for (let i = 0; i < second_values.length; i++) {
    console.log(i)
    await insert_relation(
      relation_table,
      first_table,
      first_field,
      first_value_field,
      typeof first_values == "string" ? first_values : first_values[i],
      second_table,
      second_field,
      second_value_field,
      second_values[i],
      req
    );
  }
};

module.exports = {
  get,
  validate_get,
  validate_insertion,
  insert_relation,
  get_query,
  get_ids_query,
  get_ids,
  validate_insertions,
  insert_arr,
};
