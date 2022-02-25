// express engine 
const express = require('express')
const path = require('path');
const app = express();
const rm = require('./utils/storage/rm');
const moment = require('moment');
const env = require('./env')

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

// error handling
app.use((err, req, res, next)=>{
    console.log('Handling Error',err)
    rm.array(req)
    if(!req.headersSent){
        let status_code = env.response.status_codes.server_error
        if(Object.hasOwnProperty.call(err,'status_code')){
            status_code = err.status_code
        }
        let error_message = {error:{err:err,msg:'Server error occured', name:"Server Error"}}
        if(Object.hasOwnProperty.call(err,'error')){
            if(Object.hasOwnProperty.call(err.error,'msg')){
                error_message = err
            }
        }
        res.status(status_code).json(error_message)
    }
})

// server launch 
const port = 3000;
app.listen(port, ()=>{
    console.log('started the server')
})

module.exports = app;
