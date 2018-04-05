const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const logger = require("./logger")

const users = require("./routes/user")
const morgan = require("morgan")

// Database connection
const config = require("config")

const dbConfig = config.DBConfig
const mongoUrl = dbConfig.prefix + dbConfig.host + "/" + dbConfig.name
const port = config.ServerConfig.port

const connectWithRetry = function () {
    return mongoose.connect(mongoUrl)
        .then(() => {
            logger.info("Connecting to database : " + dbConfig.host)
        })
        .catch((err) => {
            if (err) {
                logger.error(err)
                setTimeout(connectWithRetry, 5000)
            }
        })
}

connectWithRetry()

let db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))

// Initialize our app variable
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan("dev"))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, PUT")
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

app.use(bodyParser.json())

app.use("/api/user", users)

app.listen(port, () => {
    console.log("listening on port " + port)
})

module.exports = app
