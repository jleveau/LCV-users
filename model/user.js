
const UserModel = require("./schema")
const logger = require("../logger")

class UserController {
    register (user) {
        return new Promise((resolve, reject) => {
            const username = user.username
            const password = user.password

            // validate the request
            if (!(username && password)) {
                return reject(new Error("Invalid Credentials"))
            }
            UserModel.count({username})
                .then((count) => {
                    if (count > 0) {
                        return reject(new Error("User already exists"))
                    }
                    const user = new UserModel({
                        username
                    })
                    return user.save()
                })
                .then(() => resolve("Registration was successful"))
                .catch((error) => {
                    logger.error(error)
                    reject(new Error("Failed to register"))
                })
        })
    }

    login (done) {
        return new Promise((resolve, reject) => {
            resolve("ok")
        })
    }
}

module.exports = new UserController()
