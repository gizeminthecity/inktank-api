const { Schema, model } = require("mongoose");

const artistSchema = new Schema({
    name: String,

    city: String,

    country: String,

    price: Number,

    studio: String,

    consultation: Number,

    works: [String],

    about: String,

    photo: {
        type: String,
        default:
            "https://res.cloudinary.com/gizemella/image/upload/v1619121026/new-change-org/ub50aviri68vh64fdmbo.jpg",
    },

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
});

const Artist = model("Artist", artistSchema);

module.exports = Artist;
