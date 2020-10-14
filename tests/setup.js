const request = require('supertest-as-promised')
const server = require('../config')
const mongoose = require('../config/mongoose')

mongoose.Datetime.remove({}, ()=>{
    console.log('cleaned collection!')
}) 