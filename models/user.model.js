const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: { type: String },
        email: { type: String, match: /^\S+@\S+\.\S+$/, required: true },
        hashedPassword: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function save(next) {
    try {
        //   if (!this.isModified("password")) return next();

        //   const rounds = env === "test" ? 1 : 10;

        //   const hash = await bcrypt.hash(this.password, rounds);
        //   this.password = hash;

        return next();
    } catch (error) {
        return next(error);
    }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
userSchema.pre("update", async function (next) {
    try {
        //   if (!this.isModified("password")) return next();

        //   const rounds = env === "test" ? 1 : 10;

        //   const hash = await bcrypt.hash(this.password, rounds);
        //   this.password = hash;

        return next();
    } catch (error) {
        return next(error);
    }
});

/**
 * Methods
 */
userSchema.method({
    transform() {
        const transformed = {};
        const fields = ["name", "email"];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    },

    publicInfoTransform() {
        const transformed = {};
        const fields = ["id", "firstname", "lastname", "picture"];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    },

    token() {
        const playload = {
            exp: moment().add(jwtExpirationInterval, "minutes").unix(),
            iat: moment().unix(),
            sub: this._id,
        };
        return jwt.encode(playload, jwtSecret);
    },

    async passwordMatches(password) {
        return bcrypt.compare(password, this.password);
    },
});

/**
 * Statics
 */
userSchema.statics = {
    async getUserDetail(email) {
        try {
            //<!-- Get User based on email -->
            const userModel = await this.findOne({ email: email }).exec();

            if (!userModel) return null;
            //transform data

            return userModel;
        } catch (error) {
            throw error;
        }
    },
    /**
     * Get user
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    async get(id) {
        try {
            let user;

            if (mongoose.Types.ObjectId.isValid(id)) {
                user = await this.findById(id).exec();
            }
            if (user) {
                return user;
            }

            throw new APIError({
                message: "User does not exist",
                status: httpStatus.NOT_FOUND,
            });
        } catch (error) {
            throw error;
        }
    },

    /**
     * Find user by email and tries to generate a JWT token
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    async findAndGenerateToken(options) {
        const { email, password, refreshObject } = options;
        if (!email)
            throw new APIError({
                message: "An email is required to generate a token",
            });

        const user = await this.findOne({ email }).exec();
        const err = {
            status: httpStatus.BAD_REQUEST,
            isPublic: true,
        };
        if (password) {
            if (user && (await user.passwordMatches(password))) {
                return { user, accessToken: user.token() };
            }
            err.message = "Incorrect email or password";
        } else if (refreshObject && refreshObject.userEmail === email) {
            if (moment(refreshObject.expires).isBefore()) {
                err.message = "Invalid refresh token.";
            } else {
                return { user, accessToken: user.token() };
            }
        } else {
            err.message = "Incorrect email or refreshToken";
        }
        throw new APIError(err);
    },

    /**
     * List users in descending order of 'createdAt' timestamp.
     *
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - Limit number of users to be returned.
     * @returns {Promise<User[]>}
     */
    async list({ page = 1, perPage = 30, term }) {
        const reg = new RegExp(term, "i");
        return this.aggregate([
            {
                $project: {
                    fullname: { $concat: ["$firstname", " ", "$lastname"] },
                    fullname1: { $concat: ["$lastname", " ", "$firstname"] },
                    firstname: 1,
                    lastname: 1,
                    picture: 1,
                    id: "$_id",
                },
            },
            { $match: { $or: [{ fullname: reg }, { fullname1: reg }] } },
            {
                $project: {
                    fullname: 0,
                    fullname1: 0,
                    _id: 0,
                },
            },
        ]);
    },

    /**
     * Return new validation error
     * if error is a mongoose duplicate key error
     *
     * @param {Error} error
     * @returns {Error|APIError}
     */
    checkDuplicateEmail(error) {
        if (error.name === "MongoError" && error.code === 11000) {
            return new APIError({
                message: "Validation Error",
                errors: [
                    {
                        field: "email",
                        location: "body",
                        messages: ['"email" already exists'],
                    },
                ],
                status: httpStatus.CONFLICT,
                isPublic: true,
                stack: error.stack,
            });
        }
        return error;
    },

    async oAuthLogin({ service, id, email, name, picture }) {
        const user = await this.findOne({
            $or: [{ [`services.${service}`]: id }, { email }],
        });
        if (user) {
            user.services[service] = id;
            if (!user.name) user.name = name;
            if (!user.picture) user.picture = picture;
            return user.save();
        }
        const password = uuidv4();
        return this.create({
            services: { [service]: id },
            email,
            password,
            name,
            picture,
        });
    },
};

const User = mongoose.model("profile", userSchema, "user");
module.exports = User;
