
class AuthController {
    getAccessToken () {
        return new Promise((resolve, reject) => {
            resolve("ok")
        })
    }

    getAuthorizationCode (done) {
        return new Promise((resolve, reject) => {
            resolve("ok")
        })
    }

    getClient () {
        return new Promise((resolve, reject) => {
            resolve("ok")
        })
    }

    getUser () {
        return new Promise((resolve, reject) => {
            resolve("ok")
        })
    }
}

module.exports = new AuthController()
