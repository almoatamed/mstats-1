const multer = require("multer");
const moment = require("moment");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/"));
  },
  filename: function (req, file, cb) {
    let date = moment()
      .toISOString()
      .replace(/\-/g, "_")
      .replace(/:/g, "-")
      .replace(".", "-");
    let name =
      file.fieldname +
      "_" +
      Math.floor(Math.random() * 10) +
      Math.floor(Math.random() * 10) +
      "_" +
      date +
      "." +
      file.mimetype.split("/")[1];
    cb(null, name);
  },
});

module.exports = storage;
