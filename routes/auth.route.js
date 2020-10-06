const express = require("express")
const router = express.Router()

const controller = require("../controllers/auth.controller")
const { validate } = require("../validation/auth.validation")
const passport = require("passport")

// const posts = [
//     {
//         username: "Dantis",
//         title: "post 1",
//     },
//     {
//         username: "Vus",
//         title: "post 2",
//     },
// ]
// router.get("/posts", authenticateToken, (req, res) => {
//     res.json(posts.filter((post) => post.username === req.user.sub))
// })

router.route("/login").post(
    passport.authenticate("local"),
    controller.Login
)
router.route("/register").post(validate.register(), controller.Register)
router.route("/token").get(validate.token(),controller.GetToken)
router.route("/status").get((req, res) => res.send("OK"))
router.route("/logout").get(validate.token(),controller.RemoveToken)

router.route('/api/verify').get(validate.token(),controller.Verify)

module.exports = router
