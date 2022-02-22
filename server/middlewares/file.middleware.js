const env = require("../env");
const fs = require("fs");
const pq = require("../database/helpers/promise_query.db");
const uq = require("../database/helpers/is_unique.db");

const register = async (request, response, next) => {
  if (!!Object.values(request.files || {}).length) {
    console.log('starting registring file in db')
    request.saved_files = [];
    try {
      for (file of request.files) {
        const file_data = file;
        const unique = await uq("files", "path", file_data.path);
        if (!unique) {
          throw {
            error: {
              name: "file registration error",
              msg: "file path is not unique",
            },
            status_code: env.response.status_codes.repeated_query,
          };
        }
        const insertino_query = `
                  insert into files(name, type, size, path,created_by_user) values(
                      '${file_data.filename}',
                      '${file_data.mimetype}',
                      ${file_data.size},
                      '${file_data.path}',
                      ${request.user.user_id}
                  );
              `;
        await pq(insertino_query);
        const saved_file = await pq(
          `select * from files where path='${file_data.path}'`
        );
        request.saved_files.push(saved_file[0]);
      }
      console.log(request.saved_files)
      request.isFile = true;
      next();
    } catch (error) {
      console.log('erorr in file registration ', error);
      for (file of (request?.files || [])) {
        fs.rm(file.path, (err) => {
          if (err) {
            console.log("error while deleting failed registration file", err);
          } else {
            console.log("Due to Error, Deleting File", file.path);
          }
        });
      }
      next(error);
    }
  } else {
    request.isFile = false;
    next();
  }
};

module.exports = {
  register,
};
