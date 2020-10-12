const {
    generateAccessToken,
    generateRefreshToken,
    getTokenType,
    parseTokenAndGetUserId,
} = require('./token.utils')

const userId = 'AB91E463D688CA4270DFF30FA20A5717'
const accessToken = generateAccessToken(userId);
const refreshToken = generateRefreshToken(userId);

it("get token type", () => {
    expect(getTokenType(accessToken)).toBe('access_token');
    expect(getTokenType(refreshToken)).toBe('refresh_token');
});

it("get user id", () => {
    expect(parseTokenAndGetUserId(accessToken)).toBe(parseTokenAndGetUserId(refreshToken));
});