const path = require("path")
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV.trim() !== "production") {
	if (process.env.NODE_ENV.trim() === "test") {
		require("dotenv").config({
			path: path.join(__dirname, "../test.env"),
		})
	} else {
		require("dotenv").config({
			path: path.join(__dirname, "../.env"),
		})
	}
}

module.exports = {
  NODE_ENV:process.env.NODE_ENV,
	PORT: process.env.PORT,
	MONGODB_URL: process.env.MONGODB_URL,
	SECRET: process.env.SECRET,
	SESSION_SECRET: process.env.SESSION_SECRET,
	ACCESS_TOKEN: process.env.ACCESS_TOKEN,
	REFRESH_TOKEN: process.env.REFRESH_TOKEN,
	AUDIENCE: process.env.AUDIENCE,
	ISSUER: process.env.ISSUER,
	ACCESS_TOKEN_EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION,
	REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION,
	REFRESH_TOKEN_COOKIE_EXPIRATION: process.env.REFRESH_TOKEN_COOKIE_EXPIRATION,
}
