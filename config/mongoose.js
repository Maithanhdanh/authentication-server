const mongoose = require('mongoose');
const logger = require('./logger');

const URL = process.env.MONGODB_URL;

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