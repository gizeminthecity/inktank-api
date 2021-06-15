const { Schema, model } = require("mongoose");

const studioSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        about: String,

        city: String,

        country: String,

        location: String,

        price: Number,

        consultation: Number,

        photo: {
            type: String,
            default:
                "https://res.cloudinary.com/gizemella/image/upload/v1619121026/new-change-org/ub50aviri68vh64fdmbo.jpg",
        },
        works: [String],
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
        ratings: [
            {
                type: Schema.Types.ObjectId,
                ref: "Rating",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Studio = model("Studio", studioSchema);
module.exports = Studio;
