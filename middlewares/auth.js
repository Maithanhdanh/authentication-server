const responseReturn = require("../response/responseReturn")
const { validationResult } = require("express-validator")
const { verifyToken } = require("../utils/token.util")

function authenticateToken(req, res, next) {
    const errors = validationResult(req)
    let resReturn = new responseReturn()
    if (!errors.isEmpty()) return res.sendStatus(401)

    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    if (token == null) return res.sendStatus(401)

    const verifiedToken = verifyToken(token)
    if (verifiedToken.error) return res.sendStatus(403)
    req.user = verifiedToken.user
    next()
}
module.exports = { authenticateToken }
