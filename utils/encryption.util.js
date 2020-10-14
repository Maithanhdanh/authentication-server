
const CryptoJS = require("crypto-js");
const ENV_VAR = require('../config/vars')

const secret = ENV_VAR.SECRET;

const encrypt= (string) => CryptoJS.AES.encrypt(string, secret).toString();


const decrypt= (string) => CryptoJS.AES.decrypt(string, secret).toString(CryptoJS.enc.Utf8)

module.exports={ encrypt, decrypt}
