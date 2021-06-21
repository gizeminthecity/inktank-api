const { Schema, model } = require("mongoose");

const USER_ROLE_ENUM = require("../utils/consts");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
        },

        password: { type: String, required: true },

        email: { type: String, unique: true, required: true },

        role: {
            type: String,
            enum: USER_ROLE_ENUM,
            default: "Enthusiast",
        },

        name: String,

        city: String,

        country: String,

        about: String,

        studio: {
            type: Schema.Types.ObjectId,
            ref: "Work",
        },

        works: [
            {
                type: Schema.Types.ObjectId,
                ref: "Work",
            },
        ],

        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: "Work",
            },
        ],

        photo: {
            type: String,
            default:
                "https://res.cloudinary.com/gizemella/image/upload/v1619121026/new-change-org/ub50aviri68vh64fdmbo.jpg",
        },
    },

    {
        timestamps: true,
    }
);

const User = model("User", userSchema);

module.exports = User;
