const { Schema, model } = require("mongoose");

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

        name: String,

        city: String,

        country: String,

        about: String,

        photo: {
            type: String,
            default:
                "https://res.cloudinary.com/gizemella/image/upload/v1619121026/new-change-org/ub50aviri68vh64fdmbo.jpg",
        },
        likes: [{ type: Schema.Types.ObjectId, ref: "Artist" }],
    },

    {
        timestamps: true,
    }
);

const User = model("User", userSchema);

module.exports = User;
