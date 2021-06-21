const { Schema, model } = require("mongoose");

const workSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        photo: {
            type: String,
        },

        caption: { type: String },

        likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
    },

    {
        timestamps: true,
    }
);

const Work = model("Work", workSchema);
module.exports = Work;
