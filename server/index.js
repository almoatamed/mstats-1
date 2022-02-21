// express engine 
const express = require('express')
const path = require('path');
const moment = require('moment')
const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// logger 
app.use((req,res,next)=>{
    console.log(`\n${req.protocolreq}://${req.get('host')}${req.originalUrl}: ${moment()}`)    
    next()
})

// router 
app.use('/server/api',require('./routers/main'))

// Set static folder
app.use('/server/files', express.static(path.join(__dirname, 'public')));

// server launch 
const port = 3000;
app.listen(port, ()=>{
    console.log('started the server')
})

module.exports = app;
