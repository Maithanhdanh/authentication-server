const ENV_VAR = require('./vars')

const mongoose = require('mongoose');
const logger = require('./logger');

const URL = ENV_VAR.MONGODB_URL;

mongoose.Promise = Promise;

mongoose.connection.on('error', err =>{
    logger.info(`MongoDB connection error: ${err}`)
    process.exit(-1)
})

exports.connect = () => {
    mongoose.connect(URL, { 
        useCreateIndex:true,
        keepAlive:1,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => logger.info('MongoDB connected...'));
    return mongoose.connection
}