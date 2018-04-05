
const UserModel = require("./schema").User
const TokenModel = require("./schema").Token
const logger = require("../logger")
const uuidv4 = require("uuid/v4")

class UserController {
    register (user) {
        return new Promise((resolve, reject) => {
            const username = user.username
            const password = user.password
            // validate the request

            if (!username || !password) {
                return reject(new Error("Invalid Credentials"))
            }
            UserModel.count({username})
                .then((count) => {
                    if (count > 0) {
                        return reject(new Error("User already exists"))
                    }
                    const user = new UserModel({
                        username,
                        password
                    })
                    return user.save()
                })
                .then((user) => {
                    return resolve("Registration was successful")
                })
                .catch((error) => {
                    logger.error(error)
                    reject(new Error("Failed to register"))
                })
        })
    }

    login (auth) {
        return new Promise((resolve, reject) => {
            const username = auth.username
            const password = auth.password
            let user = null
            if ((!username || !password)) {
                return reject(new Error("Invalid Credentials"))
            }
            UserModel.findOne({username})
                .then((userFound) => {
                    if (!userFound) {
                        return reject(new Error("Not registered, or wrong password / username combination"))
                    }
                    if (password !== userFound.password) {
                        return reject(new Error("Not registered, or wrong password / username combination"))
                    }

                    const token = new TokenModel({
                        user: userFound,
                        accessToken: uuidv4()
                    })
                    user = userFound
                    return token.save()
                })
                .then((token) => {
                    resolve({
                        accessToken: token.accessToken,
                        user
                    })
                })
                .catch((error) => {
                    logger.error(error)
                    return reject(new Error("failed during login"))
                })
        })
    }

    authorize (user, token) {
        return new Promise((resolve, reject) => {
            UserModel.findOne(user)
                .then((userFound) => {
                    if (!userFound) {
                        reject(new Error("user does not exists"))
                    }
                    return TokenModel.find({
                        user: userFound
                    })
                })
                .then((userTokens) => {
                    userTokens.forEach((userToken) => {
                        if (userToken && userToken.accessToken === token) {
                            resolve("granted")
                        }
                    })
                    reject(new Error("permission denied"))
                })
        })
    }
}

module.exports = new UserController()
