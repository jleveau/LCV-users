const express = require("express")
const router = express.Router()
const User = require("../model/user")

router.post("/register", (req, res) => {
    User.register(req.body.user)
        .then((message) =>
            res.status(200).send({ status: 200, message }))
        .catch((error) => {
            res.status(500).send({ status: 500, message: error.message })
        })
})

router.post("/login", (req, res) => {
    User.login(req.body.auth)
        .then((log) =>
            res.status(200).send({ status: 200, accessToken: log.accessToken, user: log.user }))
        .catch((error) => {
            res.status(500).json({ status: 500, message: error.message })
        })
})

router.post("/authorize", (req, res) => {
    User.authorize(req.body.user, req.body.accessToken)
        .then((message) =>
            res.status(200).send({ status: 200, message }))
        .catch((error) => {
            res.status(500).send({ status: 500, message: error.message })
        })
})

module.exports = router
