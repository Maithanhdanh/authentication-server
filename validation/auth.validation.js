const { header, body, cookie } = require("express-validator")

let oAuth = () => {
    return [header(["authorization"]).exists().notEmpty()]
}

let register = () => {
    return [
        body(["name"]).trim().exists(),
        body(["email"]).trim().exists().isString().notEmpty(),
        body(["password"]).trim().exists().isString().notEmpty(),
    ]
}

let token = () => {
    return [
        cookie(['refresh_token']).exists().notEmpty()
    ]
}

let validate = {
    oAuth: oAuth,
    token:token,
    register:register
}

module.exports = { validate }
