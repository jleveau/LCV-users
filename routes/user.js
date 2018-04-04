const express = require("express")
const router = express.Router()
const logger = require("../logger")
const User = require("../model/user")

router.post("/register", (req, res) => {
    User.register(req.body)
        .then((message) =>
            res.status(200).send({ status: 200, message }))
        .catch((error) => {
            res.status(500).send({ status: 500, message: error.message })
        })
})

router.post("/login", (req, res) => {
    User.login()
        .then((auth) =>
            res.status(200).send({ status: 200, auth }))
        .catch((error) => {
            res.status(500).send({ status: 500, message: error.message })
        })
})

module.exports = router
