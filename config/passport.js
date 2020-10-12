const LocalStrategy = require("passport-local").Strategy
const User = require("../models/user.model")
const bcrypt = require('bcryptjs')

require("dotenv").config()

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        const user = await User.getUserDetail(email)
        if (user == null) {
            return done(null, false, { message: "No user with that email" })
        }

        try {
            if (await bcrypt.compare(password, user.hashedPassword)) {
                
                return done(null, user)
            } else {
                return done(null, false, { message: "Password incorrect" })
            }
        } catch (e) {
            return done(e)
        }
    }

    passport.use(
        new LocalStrategy(
            {
                usernameField:'email'
            },
            authenticateUser
        )
    )

    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        User.findById(id)
            .then(function (user) {
                done(null, user)
            })
            .catch(function (err) {
                console.log(err)
            })
    })
}

module.exports = initialize
