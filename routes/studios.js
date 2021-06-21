const router = require("express").Router();

const Session = require("../models/Session.model");
const User = require("../models/User.model");
const Studio = require("../models/Studio.model");
const Review = require("../models/Review.model");

const isLoggedIn = require("../middleware/isLoggedIn");

const upload = require("../middleware/cloudinary");

// ADD STUDIO

router.post("/add", isLoggedIn, (req, res) => {
    User.findOne({ _id: req.user._id })
        .then((foundUser) => {
            console.log("FOUND USER: ", foundUser);
            const {
                name,
                city,
                country,
                location,
                about,
                consultation,
                price,
            } = req.body;

            Studio.create({
                name,
                city,
                country,
                location,
                consultation,
                price,
                about,
                owner: foundUser,
            })
                .then((createdStudio) => {
                    console.log("NEW STUDIO: ", createdStudio);
                    res.json({ studio: createdStudio });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({ errorMessage: err.message });
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ errorMessage: err.message });
        });
});

// ALL STUDIOS

router.get("/", (req, res) => {
    Studio.find({})
        .populate("owner")
        .then((allStudios) => {
            console.log(allStudios);
            res.json(allStudios);
        })
        .catch((err) => {
            console.log(err);
            res.json(500).json({ errorMessage: err.message });
        });
});

// SINGLE STUDIO

router.get("/:studioId", isLoggedIn, (req, res) => {
    Studio.findById(req.params.studioId)
        .populate("reviews")
        .then((studio) => {
            console.log(studio);
            res.json(studio);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ errorMessage: err.message });
        });
});

// EDIT STUDIO

router.get("/:studioId/edit", isLoggedIn, (req, res) => {
    Studio.findById(req.params.studioId)
        .then((studio) => {
            console.log("STUDIO: ", studio);
            res.json(studio);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ errorMessage: err.message });
        });
});

router.put("/:studioId/edit", isLoggedIn, (req, res) => {
    Studio.findById(req.params.studioId).then((foundStudio) => {
        console.log("Found Studio: ", foundStudio);
        const { name, about, consultation, price, location } = req.body;
        Studio.findByIdAndUpdate(
            req.params.studioId,
            { name, about, consultation, price, location },
            { new: true }
        )
            .then((updatedStudio) => {
                console.log(updatedStudio);
                res.json({ studio: updatedStudio });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({ errorMessage: err.message });
            });
    });
});

// ADD REVIEW

router.post("/:studioId/add-review", isLoggedIn, (req, res) => {
    const { title, body } = req.body;
    if (!title || !body) {
        return res.status(400).json({ errMessage: "Please fill the form " });
    }

    Review.create({ title, body, user: req.user._id }).then((newReview) => {
        Studio.findByIdAndUpdate(
            req.params.studioId,
            {
                $addToSet: { reviews: newReview._id },
            },
            { new: true }
        )
            .populate("reviews")
            .then((updatedStudio) => {
                res.json({ studio: updatedStudio });
            });
    });
});

// UPDATE STUDIO PHOTO

router.post(
    "/:studioId/update-photo",
    isLoggedIn,
    upload.single("photo"),
    (req, res) => {
        const photo = req.file.path;

        Studio.findByIdAndUpdate(req.params.studioId, { photo }, { new: true })
            .then((foundStudio) => {
                console.log(foundStudio);

                res.json({
                    photoFromServer: photo,
                    message: "Photo Uploaded successfully",
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({ errorMessage: err.message });
            });
    }
);

module.exports = router;
