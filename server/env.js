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
        seed_key:'1234asdf',
        bcrypt:{
            rounds: 10
        },
        jwt:{
            secret: "hah!whats_wrong?"
        }
    }
}