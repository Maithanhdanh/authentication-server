const ENV_VAR = require('./config/vars.js')
const logger = require('./config/logger')
const server = require('./config/express')
const mongoose = require('./config/mongoose')

mongoose.connect()

server.listen(ENV_VAR.PORT, () => {
    logger.info(`Server is running on port ${ENV_VAR.PORT} (development)`)
})

module.exports = server;