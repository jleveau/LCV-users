
const UserModel = require("./schema").User
const TokenModel = require("./schema").Token
const logger = require("../logger")
const uuidv4 = require("uuid/v4")
const Encrypt = require("../encrypt/encrypt")

class UserController {
    register (user) {
        return new Promise((resolve, reject) => {
            const username = user.username
            let password = user.password
            // validate the request

            if (!username || !password) {
                return reject(new Error("Identifiants invalides"))
            }
            password = Encrypt.encrypt(user.password)
            UserModel.count({username})
                .then((count) => {
                    if (count > 0) {
                        return reject(new Error("L'utilisateur existe déjà"))
                    }
                    const user = new UserModel({
                        username,
                        password
                    })
                    return user.save()
                })
                .then((user) => {
                    return resolve("Inscription réussie")
                })
                .catch((error) => {
                    logger.error(error)
                    reject(new Error("Erreur lors de l'inscription"))
                })
        })
    }

    login (auth) {
        return new Promise((resolve, reject) => {
            const username = auth.username
            const password = auth.password
            let user = null
            if ((!username || !password)) {
                return reject(new Error("Identifiants invalides"))
            }
            UserModel.findOne({username})
                .then((userFound) => {
                    if (!userFound) {
                        return reject(new Error("L'utilisateur n'est pas inscrit, ou mauvaise combinaison de nom d'utiliteur / mot de passe"))
                    }
                    if (password !== Encrypt.decript(userFound.password)) {
                        return reject(new Error("L'utilisateur n'est pas inscrit, ou mauvaise combinaison de nom d'utiliteur / mot de passe"))
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
                    return reject(new Error("Erreur lors de l'authentification"))
                })
        })
    }

    authorize (user, token) {
        return new Promise((resolve, reject) => {
            UserModel.findOne(user)
                .then((userFound) => {
                    if (!userFound) {
                        reject(new Error("L'utilisateur n'existe pas"))
                    }
                    return TokenModel.find({
                        user: userFound
                    })
                })
                .then((userTokens) => {
                    userTokens.forEach((userToken) => {
                        if (userToken && userToken.accessToken === token) {
                            resolve("Permission accordée")
                        }
                    })
                    reject(new Error("Permission refusée"))
                })
        })
    }
}

module.exports = new UserController()
