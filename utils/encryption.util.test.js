const { encrypt, decrypt } = require("./encryption.utils");

it("encrypt and decrypt string based on SECRET", () => {
    const string = 'IrisianTestEncryption'
    expect(decrypt(encrypt(string))).toBe(string);
});
