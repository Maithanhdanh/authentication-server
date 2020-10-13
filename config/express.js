const express = require("express")
const session = require("express-session")
const app = express()
const morgan = require("morgan")
const cors = require("cors")
const router = require("../routes/index")
const passport = require("passport")
const User = require("../models/user.model")
const initialize = require("./passport")
const cookieParser = require("cookie-parser")
const ENV_VAR = require("./vars")

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(cookieParser());

initialize(passport, (email) =>
    User.find((user) => user.email === email)
)
app.use(passport.initialize())
app.use(passport.session())

app.use(morgan("dev"))
app.use(
    session({
        secret: ENV_VAR.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
)

app.use("/", router)

const server = require("http").Server(app)



module.exports = server
