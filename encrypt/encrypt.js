const fs = require("fs")
const crypto = require("crypto")

class Encrypt {
    constructor () {
        this.key = fs.readFileSync("key_pass").toString()
    }

    encrypt (word) {
        var mykey = crypto.createCipher("aes-128-cbc", this.key)
        var mystr = mykey.update(word, "utf8", "hex")
        mystr += mykey.final("hex")
        return mystr
    }

    decript (cryptedWord) {
        var mykey = crypto.createDecipher("aes-128-cbc", this.key)
        var mystr = mykey.update(cryptedWord, "hex", "utf8")
        mystr += mykey.final("utf8")
        return mystr
    }
}
module.exports = new Encrypt()
