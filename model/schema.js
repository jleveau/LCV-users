const mongoose = require("mongoose")

const Token = mongoose.model("OAuthTokens", new mongoose.Schema({
    accessToken: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}))

const User = mongoose.model("User", new mongoose.Schema({
    email: { type: String, default: "" },
    password: { type: String },
    username: { type: String }
}))

module.exports = {
    Token,
    User
}
