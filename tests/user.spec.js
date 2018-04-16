process.env.NODE_ENV = "test"
const server = require("../app")// eslint-disable-line no-unused-vars
const requestSender = require("./request_sender")
const chai = require("chai")
const expect = chai.expect
const User = require("../model/user")
const UserSchema = require("../model/schema").User
const TokenSchema = require("../model/schema").Token

describe("API", () => {
    describe("register", () => {
        beforeEach((done) => {
            UserSchema.remove({})
                .then(() => done())
                .catch((error) => done(error))
        })

        it("send /api/user/register", (done) => {
            const user =
            {
                username: "toto",
                password: "my_password"
            }
            requestSender.createPost("/api/user/register", {
                user
            })
                .then((response) => {
                    expect(response.status).to.be.eql(200)
                    expect(response.message).be.eql("Inscription réussie")
                    return UserSchema.findOne({
                        username: "toto"
                    })
                })
                .then((usercreated) => {
                    expect(usercreated.username).to.be.eql(user.username)
                    expect(usercreated.password).to.not.be.eql(user.password)
                    expect(usercreated.password).to.not.be.eql(null)

                    done()
                })
                .catch((error) => done(error))
        })

        it("send /api/user/register with no password", (done) => {
            const user =
            {
                username: "toto"
            }
            requestSender.createPost("/api/user/register", {
                user
            })
                .then(() => {
                    done("should have failed")
                })
                .catch((error) => {
                    expect(error).to.be.eql("Identifiants invalides")
                    UserSchema.findOne({user}).then((usercreated) => {
                        expect(usercreated).to.be.eql(null)
                        done()
                    })
                })
        })
    })

    describe("login", () => {
        const auth = {
            username: "toto",
            password: "toto"
        }
        beforeEach((done) => {
            UserSchema.remove({})
                .then(() => {
                    return User.register({
                        username: auth.username,
                        password: auth.password
                    })
                })
                .then((res) => {
                    done()
                })
                .catch((error) => done(error))
        })

        it("send /api/user/login", (done) => {
            requestSender.createPost("/api/user/login", {
                auth
            })
                .then((response) => {
                    const token = response.accessToken
                    const user = response.user
                    expect(token).to.not.be.eql(null)
                    expect(user._id).to.not.eql(null)
                    expect(user._id).to.not.eql(undefined)
                    done()
                })
        })

        it("send /api/user/login with wrong password", (done) => {
            const auth =
            {
                username: "toto",
                password: "tata"
            }
            requestSender.createPost("/api/user/login", {
                auth
            })
                .then((response) => {
                    done("should have failed")
                })
                .catch((error) => {
                    const token = error.accessToken
                    expect(token).to.eql(undefined)
                    expect(error).to.eql("L'utilisateur n'est pas inscrit, ou mauvaise combinaison de nom d'utiliteur / mot de passe")
                    done()
                })
        })
    })

    describe("authorize", () => {
        let accessToken = null
        let user = null
        beforeEach((done) => {
            const auth = {
                username: "toto",
                password: "toto"
            }
            UserSchema.remove({})
                .then(() => {
                    return User.register(auth)
                })
                .then(() => {
                    return TokenSchema.remove({})
                })
                .then(() => {
                    return User.login(auth)
                })
                .then((res) => {
                    accessToken = res.accessToken
                    user = res.user
                    done()
                })
                .catch((error) => done(error))
        })

        it("send /api/user/authorize", (done) => {
            requestSender.createPost("/api/user/authorize", {
                user,
                accessToken
            })
                .then((response) => {
                    expect(response.status).to.be.eql(200)
                    expect(response.message).to.be.eql("Permission accordée")
                    done()
                })
        })

        it("send /api/user/authorize", (done) => {
            requestSender.createPost("/api/user/authorize", {
                accessToken: "badToken",
                user
            })
                .then((response) => {
                    done("should have failed")
                }).catch((error) => {
                    expect(error).to.be.eql("Permission refusée")
                    done()
                })
        })
    })
})
