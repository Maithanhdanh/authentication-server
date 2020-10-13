const jwt = require("jsonwebtoken")
const { encrypt, decrypt } = require("./encryption.util")
const ENV_VAR = require('../config/vars')

const ACCESS_TOKEN = "access_token"
const REFRESH_TOKEN = "refresh_token"
const TokenType = {
    ACCESS_TOKEN: ACCESS_TOKEN,
    REFRESH_TOKEN: REFRESH_TOKEN,
}

const generateAccessToken = (userId) =>
    generateToken(userId, TokenType.ACCESS_TOKEN)
const generateRefreshToken = (userId) =>
    generateToken(userId, TokenType.REFRESH_TOKEN)

const generateToken = (userId, type = TokenType.REFRESH_TOKEN) => {
    const audience = ENV_VAR.AUDIENCE
    const issuer = ENV_VAR.ISSUER
    const secret = ENV_VAR.SECRET

    const expiresIn = type === TokenType.ACCESS_TOKEN ? "15m" : "2d"

    const token = jwt.sign({ type }, secret, {
        expiresIn,
        audience: audience,
        issuer: issuer,
        subject: userId,
    })
    const expiresInNum =
        type === TokenType.ACCESS_TOKEN ? 15 * 60000 : 2 * 24 * 60 * 60000
    return {
        token: encrypt(token),
        expiresIn: Date.now() + expiresInNum,
    }
}

const verifyToken = (token) => {
    const secret = ENV_VAR.SECRET
    const decryptedToken = decrypt(token) 
    const verifiedToken = jwt.verify(decryptedToken, secret, (err, user) => {
        if (err)
            return {
                error: true,
                message: err,
            }
        return {
            error: false,
            user: user,
        }
    })

    return verifiedToken
}
const getTokenType = (token) => {
    const decryptedToken = decrypt(token)
    const secret = ENV_VAR.SECRET

    return jwt.verify(decryptedToken, secret).type
}

const parseTokenAndGetUserId = (token) => {
    const decryptedToken = decrypt(token)
    const secret = ENV_VAR.SECRET

    const decoded = jwt.verify(decryptedToken, secret, (err, user) => {
        if (err)
            return {
                error: true,
                message: err,
            }
        return {
            error: false,
            sub: user.sub || "",
        }
    })

    return decoded
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    getTokenType,
    parseTokenAndGetUserId,
}
