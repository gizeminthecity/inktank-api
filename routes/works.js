const router = require("express").Router();

const Session = require("../models/Session.model");
const User = require("../models/User.model");
const Work = require("../models/Work.model");
const Studio = require("../models/Studio.model");

const isLoggedIn = require("../middleware/isLoggedIn");

const upload = require("../middleware/cloudinary");

// ADD WORK

router.post("/add", isLoggedIn, upload.single("photo"), (req, res) => {
    const photo = req.file.path;
    const { caption } = req.body;
    User.findById(req.user._id)
        .then((foundUser) => {
            console.log("FOUND USER: ", foundUser);

            if (foundUser) {
                Work.create({
                    caption,
                    photo,
                    owner: req.user._id,
                    likes: [req.user_id],
                })
                    .then((createdWork) => {
                        User.findByIdAndUpdate(req.user._id, {
                            $push: { works: createdWork._id },
                        }).catch((err) => {
                            res.status(500).json({ errorMessage: err.message });
                        });
                        res.json({ createdWork });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).json({ errorMessage: err.message });
                    });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ errorMessage: err.message });
        });
});

// GET WORKS

router.get("/:username", isLoggedIn, (req, res) => {
    Work.find({ owner: req.user._id })
        .populate("owner")
        .then((foundWorks) => {
            console.log("FOUND WORKS: ", foundWorks);
            res.json({ works: foundWorks });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ errorMessage: err.message });
        });
});

// LIKE

router.put("/:workId/like", isLoggedIn, (req, res) => {
    User.findById(req.user._id)
        .then((foundUser) => {
            Work.findByIdAndUpdate(
                req.params.workId,
                {
                    $addToSet: { likes: foundUser._id },
                },
                { new: true }
            )
                .then((likedPhoto) => {
                    User.findByIdAndUpdate(req.user._id, {
                        $push: { likes: likedPhoto._id },
                    })
                        .then((response) => {
                            res.json(response);
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
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ errorMessage: err.message });
        });
});

router.put("/unlike", isLoggedIn, (req, res) => {
    Work.findByIdAndUpdate(
        req.body._id,
        {
            $pull: { likes: req.user._id },
        },
        { new: true }
    )
        .then((addLike) => {
            res.json({ work: addLike });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ errorMessage: err.message });
        });
});

// ADD REVIEW

router.post("/:workId/add-review", isLoggedIn, (req, res) => {
    const { title, body } = req.body;
    if (!title || !body) {
        return res.status(400).json({ errMessage: "Please fill the form " });
    }

    Review.create({ title, body, user: req.user._id }).then((newReview) => {
        Work.findByIdAndUpdate(
            req.params.workId,
            {
                $addToSet: { reviews: newReview._id },
            },
            { new: true }
        )
            .populate("reviews")
            .then((updatedWork) => {
                res.json({ work: updatedWork });
            });
    });
});

module.exports = router;
