function responseReturn() {
}

responseReturn.prototype.success = function (res, statusCode, message) {
    res.statusCode = statusCode
    res.json({error: false, response: message})
    return res
}

responseReturn.prototype.failure = function (res, statusCode, message) {
    res.statusCode = statusCode
    res.json({error: true, response: message})
    return res
}

module.exports = responseReturn;