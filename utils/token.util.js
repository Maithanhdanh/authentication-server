const jwt = require("jsonwebtoken")
const { encrypt, decrypt } = require("./encryption.util")

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
    const audience = process.env.AUDIENCE
    const issuer = process.env.ISSUER
    const secret = process.env.SECRET

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
    const secret = process.env.SECRET
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
    const secret = process.env.SECRET

    return jwt.verify(decryptedToken, secret).type
}

const parseTokenAndGetUserId = (token) => {
    const decryptedToken = decrypt(token)
    const secret = process.env.SECRET

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
