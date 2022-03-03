const env = require("../env");

module.exports = {
    is_factory_enabled: (request, response, next) => {
        if (!env.factory.enable) {
            next({
                error: {
                    msg: "Factory is disabld",
                    name: "Factory Error"
                },
                status_code: env.response.status_codes.not_autharized
            })
        } else {
            next()
        }
    }
};
