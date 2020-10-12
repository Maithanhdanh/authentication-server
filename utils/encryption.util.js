
const CryptoJS = require("crypto-js");
require('dotenv').config();

const secret = process.env.SECRET;

const encrypt= (string) => CryptoJS.AES.encrypt(string, secret).toString();


const decrypt= (string) => CryptoJS.AES.decrypt(string, secret).toString(CryptoJS.enc.Utf8)

module.exports={ encrypt, decrypt}
