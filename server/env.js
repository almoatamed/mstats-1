module.exports = {
    response:{
        status_codes:{
            invalid_field:401,
            not_autharized:421,
            not_found:404,
            server_error:500,
            repeated_query:406,
            ok:200,
        }
    },
    db: {
        mysql: {
            host: "localhost",
            user: "admin",
            socketPath: '/tmp/mysql.sock',
            password: "admin",
            database: "pharma"
        }
    },
    auth:{
        seed_key:'asdgfoiuasydviotqwoegvuiasydbviuewbjkbvuiasydgf',
        bcrypt:{
            rounds: 10
        },
        jwt:{
            secret: "shhhhhh"
        }
    }
}