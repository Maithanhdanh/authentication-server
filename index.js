const logger = require('./config/logger')
const server = require('./config/express')
const mongoose = require('./config/mongoose')

const port = process.env.PORT;

mongoose.connect()

server.listen(port, () => {
    logger.info(`Server is running on port ${port} (development)`)
})

module.exports = server;