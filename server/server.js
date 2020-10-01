// /**To make these static files available on requests from the client side */
// import path from 'path'
// // In server.js, we will first add code to import the express module in order to initialize an Express app:
// import express from 'express'
// /**compile method in server.js by adding the following lines while
// in development mode */
// import devBundle from './devBundle'

// import template from '../template'
// import {MongoClient} from 'mongodb'

// /**Then we will use this Express app to build out the rest of the Node server application. */
// const app= express()
// devBundle.compile(app) //for dev mode only--this line and shd be commented out when building
// // for pdtn

// /**This will configure the Express app to return static files from the dist folder when
// the requested route starts with /dist. */
// const CURRENT_WORKING_DIR = process.cwd()
// app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))


// /**route-handling code to the Express app to receive GET requests at /: */
// app.get('/', (req, res) => {
//     res.status(200).send(template())
// })

// /**Express app to start a server that listens on the specified port
// for incoming requests: */

// let port = process.env.PORT || 3000
// app.listen(port, function onStart(err) {
//     if (err) {
//         console.log(err)
//     }
//     console.info('Server started on port %s.', port)
// })


// //connection to db
// const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/mernSimpleSetup'
// /**In this code example, MongoClient is the driver that connects to the running
// MongoDB instance using its URL */
//     MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },(err, db) => {
//         console.log('Connected successfuly to mongodb server')
//         db.close()
//     })

import path from 'path'
import express from 'express'
import { MongoClient } from 'mongodb'
import template from './../template'
//comment out before building for production
import devBundle from './devBundle'

const app = express()
//comment out before building for production
devBundle.compile(app)

const CURRENT_WORKING_DIR = process.cwd()
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

app.get('/', (req, res) => {
  res.status(200).send(template())
})

let port = process.env.PORT || 8080
app.listen(port, function onStart(err) {
  if (err) {
    console.log(err)
  }
  console.info('Server started on port %s.', port)
})

// Database Connection URL
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/mernSimpleSetup'
// Use connect method to connect to the server
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },(err, db)=>{
  console.log("Connected successfully to mongodb server")
  db.close()
})
