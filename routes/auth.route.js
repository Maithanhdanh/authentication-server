const express = require("express")
const router = express.Router()

const controller = require("../controllers/auth.controller")
const { validate } = require("../validation/auth.validation")
const passport = require("passport")

router.route("/login").post(
    passport.authenticate("local"),
    controller.Login
)
router.route("/register").post(validate.register(), controller.Register)
router.route("/token").get(validate.token(),controller.GetToken)
router.route("/status").get((req, res) => res.json("OK"))
router.route("/logout").get(validate.token(),controller.RemoveToken)

router.route('/api/verify').get(validate.oAuth(),controller.Verify)

module.exports = router
