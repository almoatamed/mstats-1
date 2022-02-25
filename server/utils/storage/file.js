const storage = require("./storage");
const multer = require('multer')
const env = require('../../env')
const fm = require('../../middlewares/file.middleware')

var limits = (limit, size) => ({
  files: limit || 1,
  fileSize: size || 1024 * 1024,
});


const mime_condition = (mimetypes, file) => {
  console.log(file.mimetype)
  let mime_condition = false;
  if (typeof mimetypes == "object") {
    mimetypes = Object.values(mimetypes);
    mime_condition =
      mimetypes.length == 0 || mimetypes.includes(file?.mimetype);
  } else if (typeof mimetypes == "string") {
    mime_condition = mimetypes == file?.mimetype;
  } else if (!mimetypes) {
    mime_condition = true;
  }
  return mime_condition
};

module.exports = (field_name, required, file_size, mimetypes, limit) => {
  console.log(field_name, required, file_size, mimetypes, limit)
  const files_limits = limits(limit,file_size)
  return [
    multer({
      storage: storage,
      fileFilter: (req, file, cb) => {
        if (mime_condition(mimetypes, file)) {
          cb(null, true);
        } else {
          const error = {error:{msg:"Required Field messing",name:"File Error"}}
          error.status_code = env.response.status_codes.invalid_field
          cb(error, false);
        }
      },
      limits: files_limits,
    }).array(field_name,files_limits.files),
    (request, response, next) => {
      console.log(request.files)
      if (!Object.values(request.files || {}).length && required) {
        const error = {error:{msg:"Required Field messing",name:"File Error"}}
        error.status_code = env.response.status_codes.not_found
        next(error)
      } else {
        console.log('going next')
        next();
      }
    },
    fm.register
  ];
};
