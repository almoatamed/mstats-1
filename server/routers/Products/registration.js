const express = require("express");

const router = express.Router();

// file registration middleware
const image = require("../../utils/storage/image");

const pq = require("../../database/helpers/promise_query.db");
const uq = require("../../database/helpers/is_unique.db");
const eq = require('../../database/helpers/exists.db')
const rq = require('../../database/helpers/many_to_many_relations.db')

const multirules = require("../../utils/rules/multirules");

const user_middleware = require("../../middlewares/user.middleware");

const env = require("../../env");

const product_image_middle_ware = image.jpg("product_image_file", false);
router.post(
  "/",
  user_middleware.auth,
  product_image_middle_ware,
  async (req, res, next) => {
    try {
      console.log("Starting registration ",req.body);
      
      // data
      const saved_file_id = req.isFile ? req.saved_files[0].file_id : "null";
      console.log(saved_file_id);
      const product_data = req.body;
      console.log(product_data.name);
      // validation
      const validaters = [
        [["required", "title"], product_data.name, "name"],
        [["description"], product_data.description, "description"],
        [["url"], product_data.link, "link"],
        [["title"], product_data.manufacturer_name, "manufacturer_name"],
      ];
      valid = await multirules(validaters);
      if (!valid.valid) {
        console.log("validation failed");
        const error = {};
        error.error = { name: "Invalid Field", msg: valid.msg };
        error.status_code = env.response.status_codes.invalid_field;
        return next(error);
      }

      // unique name
      const unique = await uq("products", "name", product_data.name);
      if (!unique) {
        console.log("Not unique");
        const error = {};
        error.error = {
          name: "Name is used",
          msg: "this product name is used",
        };
        error.status_code = env.response.status_codes.repeated_query;
        return next(error);
      }

      // manufacturer id
      const manufacturer = await eq.validate_one(
        'manufacturers',
        'name',
        req.body.manufacturer
      )
      const manufacturer_id = manufacturer.manufacturer_id;


      // insertion
      const insertion_query = `
                  insert into products (\`name\`, \`description\`, \`link\`, \`manufacturer_id\`, \`image_id\`, \`created_by_user\`) values(
                      '${product_data.name}',
                      ${
                        !!product_data.description
                          ? "'" + product_data.description + "'"
                          : "null"
                      },
                      ${
                        !!product_data.link
                          ? "'" + product_data.link + "'"
                          : "null"
                      },
                      ${manufacturer_id},
                      ${saved_file_id},
                      ${req.user.user_id}
                  )
              `;
      await pq(insertion_query);
      return res.status(env.response.status_codes.ok).json({
        result: {
          name: "product created",
          msg: "product created successfully",
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
