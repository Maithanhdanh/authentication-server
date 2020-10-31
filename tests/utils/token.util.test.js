const {
	generateAccessToken,
	generateRefreshToken,
	getTokenType,
	verifyToken,
	parseTokenAndGetUserId,
} = require("../../utils/token.util")
const { encrypt, decrypt } = require("../../utils/encryption.util")

const userId = "AB91E463D688CA4270DFF30FA20A5717"
const accessToken = generateAccessToken(userId)
const refreshToken = generateRefreshToken(userId)

describe("Token processing", () => {
	it("Generate token", () => {
		expect(accessToken).toHaveProperty("token")
		expect(refreshToken).toHaveProperty("token")
		expect(accessToken).toHaveProperty("expiresIn")
		expect(refreshToken).toHaveProperty("expiresIn")
	})

	it("get token type", () => {
		expect(getTokenType(accessToken.token)).toBe("access_token")
		expect(getTokenType(refreshToken.token)).toBe("refresh_token")
	})

	it("get user id", () => {
		expect(parseTokenAndGetUserId(accessToken.token)).toStrictEqual(
			parseTokenAndGetUserId(refreshToken.token)
		)
		expect(parseTokenAndGetUserId(accessToken.token)).toHaveProperty(
			"sub",
			userId
		)
	})

	it("Verify access token", () => {
		expect(verifyToken(accessToken.token)).toHaveProperty("error", false)
		expect(verifyToken(accessToken.token)).toHaveProperty("user")
	})
	it("Verify refresh token", () => {
		expect(verifyToken(refreshToken.token)).toHaveProperty("error", false)
		expect(verifyToken(refreshToken.token)).toHaveProperty("user")
	})
})
