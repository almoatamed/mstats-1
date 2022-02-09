// express engine 
const express = require('express')
const app = express();


// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



// server launch 
const port = 3000;
app.listen(port, ()=>{
    // console.log('started the server')
})

module.exports = app;  