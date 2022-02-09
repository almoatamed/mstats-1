module.exports = {
    db: {
        mysql: {
            host: "localhost",
            user: "admin",
            password: "admin",
            database: "pharma"
        }
    },
    auth:{
        bcrypt:{
            rounds: 10
        },
    }
}