const User = require("../../models/user.model")
const server = require("../../index")
const request = require("supertest")
const mongoose = require("mongoose")

beforeAll(async () => {
	await User.deleteMany({})
	jest.useFakeTimers()
})

afterAll(() => {
    server.close();
})

describe("Authentication", () => {
	describe("global app status", () => {
		it("should return ok", async () => {
			const res = await request(server).get("/status").expect(200)
			expect(res.body).toBe("OK")
		})
	})

	describe("authentication routes status", () => {
		it("should return ok", async () => {
			const res = await request(server).get("/auth/status").expect(200)
			expect(res.body).toBe("OK")
		})
	})

	describe("/register ", () => {
		it("should success", async () => {
			let body = {
				name: "testUser123",
				email: "test@gmail.com",
				password: "123123123",
			}
			const res = await request(server)
				.post("/auth/register")
				.send(body)
				.expect(200)

			expect(res.body.error).toBe(false)
			expect(res.body.response.message).toBe("User is added")
			expect(res.body.response.user.name).toBe(body.name)
			expect(res.body.response.user.email).toBe(body.email)
			expect(res.body.response.accessToken).not.toBeNull()
			expect(res.body.response.accessToken).not.toBeUndefined()
			expect(typeof res.body.response.expiresIn).toBe("number")
		})

		it("should failed => without password", async () => {
			let body = {
				name: "testUser123",
				email: "test@gmail.com",
			}
			const res = await request(server)
				.post("/auth/register")
				.send(body)
				.expect(500)

			expect(res.body.error).toBe(true)
			expect(res.body.response[0].msg).toBe("Invalid value")
			expect(res.body.response[0].param).toBe("password")
			expect(res.body.response[0].location).toBe("body")
		})

		it("should failed => without email", async () => {
			let body = {
				name: "testUser123",
				password: "123123123",
			}
			const res = await request(server)
				.post("/auth/register")
				.send(body)
				.expect(500)

			expect(res.body.error).toBe(true)
			expect(res.body.response[0].msg).toBe("Invalid value")
			expect(res.body.response[0].param).toBe("email")
			expect(res.body.response[0].location).toBe("body")
		})

		it("should failed => Existed User", async () => {
			let body = {
				name: "Username",
				email: "test123@gmail.com",
				password: "123123123",
			}

			await request(server).post("/auth/register").send(body).expect(200)

			const res = await request(server)
				.post("/auth/register")
				.send(body)
				.expect(200)

			expect(res.body.error).toBe(false)
			expect(res.body.response.message).toBe("Existed User")
			expect(mongoose.Types.ObjectId.isValid(res.body.response.user._id)).toBe(
				true
			)
			expect(res.body.response.user.name).toBe(body.name)
			expect(res.body.response.user.email).toBe(body.email)
		})
	})

	describe("/login ", () => {
		beforeAll(async () => {
			let body = {
				name: "Username",
				email: "test123@gmail.com",
				password: "123123123",
			}

			await request(server).post("/auth/register").send(body).expect(200)
			jest.useFakeTimers()
		})

		it("should success", async () => {
			let body = {
				email: "test123@gmail.com",
				password: "123123123",
			}
			const res = await request(server)
				.post("/auth/login")
				.send(body)
				.expect(200)

			expect(res.body.error).toBe(false)
			expect(res.body.response.user.email).toBe(body.email)
			expect(res.body.response.accessToken).not.toBeNull()
			expect(res.body.response.accessToken).not.toBeUndefined()
			expect(typeof res.body.response.expiresIn).toBe("number")

			expect(res.header["set-cookie"]).not.toBeNull()
			expect(res.header["set-cookie"]).not.toBeUndefined()

			let refreshToken = res.header["set-cookie"][0].split(",")[0].split("=")
			expect(refreshToken[0]).toBe("refresh_token")
			expect(refreshToken[1]).not.toBe("")
			expect(refreshToken[1]).not.toBeNull()
			expect(refreshToken[1]).not.toBeUndefined()
		})

		it("should failed", async () => {
			let body = {
				email: "test123@gmail.com",
				password: "123123123123",
			}
			const res = await request(server)
				.post("/auth/login")
				.send(body)
				.expect(401)
		})
	})

	describe("/token ", () => {
		beforeAll(async () => {
			let bodyRegis = {
				name: "Username",
				email: "test123@gmail.com",
				password: "123123123",
			}

			await request(server).post("/auth/register").send(bodyRegis).expect(200)

			let bodyLogin = {
				email: "test123@gmail.com",
				password: "123123123",
			}

			jest.useFakeTimers()

			return (resLogin = await request(server)
				.post("/auth/login")
				.send(bodyLogin)
				.expect(200))
		})

		it("should success", async () => {
			const refreshToken = resLogin.header["set-cookie"][0]

			const res = await request(server)
				.get("/auth/token")
				.set("Cookie", refreshToken)
				.expect(200)

			expect(res.body.error).toBe(false)
			expect(mongoose.Types.ObjectId.isValid(res.body.response.user)).toBe(true)
			expect(res.body.response.accessToken).not.toBeNull()
			expect(res.body.response.accessToken).not.toBeUndefined()
			expect(typeof res.body.response.expiresIn).toBe("number")
		})

		it("should failed", async () => {
			const refreshToken = ""

			const res = await request(server)
				.get("/auth/token")
				.set("Cookie", refreshToken)

			expect(res.body.error).toBe(true)
			expect(res.body.response[0].msg).toBe("Invalid value")
			expect(res.body.response[0].param).toBe("refresh_token")
			expect(res.body.response[0].location).toBe("cookies")
		})
	})

	describe("/api/verify ", () => {
		beforeAll(async () => {
			let bodyRegis = {
				name: "Username",
				email: "test123@gmail.com",
				password: "123123123",
			}

			await request(server).post("/auth/register").send(bodyRegis).expect(200)

			let bodyLogin = {
				email: "test123@gmail.com",
				password: "123123123",
			}
			const resLogin = await request(server)
				.post("/auth/login")
				.send(bodyLogin)
				.expect(200)

			jest.useFakeTimers()
			return (accessToken = resLogin.body.response.accessToken)
		})

		it("should success", async () => {
			const res = await request(server)
				.get("/auth/api/verify")
				.set("authorization", `Bearer ${accessToken}`)
				.expect(200)

			expect(res.body.error).toBe(false)
			expect(mongoose.Types.ObjectId.isValid(res.body.response.userId)).toBe(
				true
			)
		})

		it("should failed => missing access token", async () => {
			const res = await request(server)
				.get("/auth/api/verify")
				.set("authorization", `Bearer `)
				.expect(401)

			expect(res.body.error).toBe(true)
			expect(res.body.response).toBe("Missing Token")
		})

		it("should failed => invalid access token", async () => {
			const res = await request(server)
				.get("/auth/api/verify")
				.set(
					"authorization",
					`Bearer ${accessToken}4134123412341234141234ereqwrqwer`
				)
				.expect(403)

			expect(res.body.error).toBe(true)
			expect(res.body.response).toBe("Invalid Token")
		})
	})

	describe("/logout ", () => {
		beforeAll(async () => {
			let bodyRegis = {
				name: "Username",
				email: "test123@gmail.com",
				password: "123123123",
			}

			await request(server).post("/auth/register").send(bodyRegis).expect(200)

			let bodyLogin = {
				email: "test123@gmail.com",
				password: "123123123",
			}
			const resLogin = await request(server)
				.post("/auth/login")
				.send(bodyLogin)
				.expect(200)

                jest.useFakeTimers()
			return (refreshToken = resLogin.header["set-cookie"][0])
		})

		it("should success", async () => {
			const res = await request(server)
				.get("/auth/logout")
				.set("Cookie", refreshToken)
				.expect(200)

			expect(res.body.error).toBe(false)
			expect(res.body.response).toBe("Removed Token")
		})

		it("should failed => missing refresh token", async () => {
			const res = await request(server).get("/auth/logout").expect(500)

			expect(res.body.error).toBe(true)
			expect(res.body.response[0].msg).toBe("Invalid value")
			expect(res.body.response[0].param).toBe("refresh_token")
			expect(res.body.response[0].location).toBe("cookies")
		})
	})
})
