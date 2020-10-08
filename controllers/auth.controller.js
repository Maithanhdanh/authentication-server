const responseReturn = require("../response/responseReturn")
const User = require("../models/user.model")
const { validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const {
    generateAccessToken,
    generateRefreshToken,
    parseTokenAndGetUserId,
    verifyToken,
} = require("../utils/token.util")

exports.Register = async (req, res, next) => {
    const errors = validationResult(req)
    let resReturn = new responseReturn()
    if (!errors.isEmpty()) {
        resReturn.failure(res, 500, errors.array())
        return
    }

    try {
        const { name, email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        // const UserModel = new User({ uid, name, email });
        const existUser = await User.getUserDetail(email)
        if (existUser != null) {
            resReturn.success(res, 200, {
                message: "Existed User",
                user: existUser,
            })
            return
        }

        const newUser = await new User({ name, email, hashedPassword }).save()
        const doc = newUser.transform()

        const accessToken = generateAccessToken(newUser._id.toString())
        const refreshToken = generateRefreshToken(newUser._id.toString())

        resReturn.success(res, 200, {
            message: "User is added",
            user: doc,
            accessToken,
            refreshToken,
        })
    } catch (errors) {
        console.log(errors)
        resReturn.failure(res, 500, errors)
    }
}

exports.Login = async (req, res) => {
    const user = req.user.transform()

    const UserId = req.user._id.toString()
    const accessToken = generateAccessToken(UserId)
    const refreshToken = generateRefreshToken(UserId)

    let resReturn = new responseReturn()

    res.cookie("refresh_token", refreshToken.token, {
        httpOnly: true,
        maxAge: 24 * 2 * 3600 * 100,
    })

    resReturn.success(res, 200, {
        user: user,
        accessToken: accessToken.token,
        expiresIn: accessToken.expiresIn,
    })
}

exports.GetToken = async (req, res) => {
    const errors = validationResult(req)
    let resReturn = new responseReturn()
    if (!errors.isEmpty()) {
        resReturn.failure(res, 500, errors.array())
        return
    }
    
    const cookies = req.cookies.refresh_token
    if (!cookies) return res.sendStatus(401)

    const verifiedToken = parseTokenAndGetUserId(cookies)
    if (verifiedToken.error) return res.sendStatus(403)
    const user = verifiedToken.sub
    const accessToken = generateAccessToken(user)

    resReturn.success(res, 200, {
        accessToken: accessToken.token,
        expiresIn: accessToken.expiresIn,
        user:user
    })
}

exports.RemoveToken = async (req, res) => {
    const errors = validationResult(req)
    let resReturn = new responseReturn()
    if (!errors.isEmpty()) {
        resReturn.failure(res, 500, errors.array())
        return
    }
    
    const cookies = req.cookies.refresh_token
    if (!cookies) return res.sendStatus(401)

    res.cookie("refresh_token", "", { maxAge: 0 })

    resReturn.success(res, 200, "Removed Token")
}

exports.Verify = async (req, res) => {
    const errors = validationResult(req)
    let resReturn = new responseReturn()
    if (!errors.isEmpty()) {
        resReturn.failure(res, 500, errors.array())
        return
    }

    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    if (token == null) return resReturn.success(res, 401, "Invalid Token")

    const verifiedToken = verifyToken(token)
    if (verifiedToken.error) return resReturn.success(res, 403, "Invalid Token")

    resReturn.success(res, 200, {userId:verifiedToken.user.sub})
}
