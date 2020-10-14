const { encrypt, decrypt } = require("../../utils/encryption.util")

describe("Encryption token", () => {
	it("encrypt and decrypt string based on SECRET", () => {
		const string = "IrisianTestEncryption"
		expect(encrypt(string)).not.toBe(string)
		expect(decrypt(encrypt(string))).toBe(string)
	})
})
