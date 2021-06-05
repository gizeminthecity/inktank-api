const { Schema, model } = require("mongoose");

const artistSchema = new Schema({
    name: String,

    city: String,

    country: String,

    picture: String,

    price: Number,

    consultation: Number,

    works: String,

    about: String,

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
