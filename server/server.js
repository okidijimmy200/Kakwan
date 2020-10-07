import config from '../config/config'
import app from './express'
// --import mongoose
import mongoose from 'mongoose'

mongoose.Promise = global.Promise
mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

mongoose.connection.on('error', (err) => {
    throw new Error(`Unable to connect to database: ${mongoUri}`)
})

app.listen(config.port, (err) => {
    if (err) {
        console.log(err)
    }
    console.log('server started on port %s', config.port)
})