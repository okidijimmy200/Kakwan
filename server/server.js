require('dotenv').config()
import express from 'express'
import config from '../config/config'
import app from './express'
// --import mongoose
import mongoose from 'mongoose'
const path  = require ('path')



mongoose.Promise = global.Promise
mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    // objects to deal with warnings
    useUnifiedTopology: true,
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(() => console.log('DB connection successful'));

mongoose.connection.on('error', (err) => {
    throw new Error(`Unable to connect to database: ${mongoUri}`)
})

console.log(process.env.USER)
app.listen(config.port, (err) => {
    if (err) {
        console.log(err)
    }
    console.log('server started on port %s', config.port)
})

//serve static files if we are in prod
if(process.env.NODE_ENV === 'production'){
    //set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}