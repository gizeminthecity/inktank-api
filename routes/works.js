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
                        // User.findByIdAndUpdate(req.user._id, {
                        //     $push: { works: createdWork._id },
                        // }).catch((err) => {
                        //     res.status(500).json({ errorMessage: err.message });
                        // });
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

//GET ALL WORKS

router.get("/explore", isLoggedIn, (req, res) => {
    Work.find({})
        .populate("owner")
        .then((allWorks) => {
            // console.log("ALL WORKS: ", allWorks);
            res.json(allWorks);
        })
        .catch((err) => {
            console.log(err);
            res.json(500).json({ errorMessage: err.message });
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

router.get("/explore/:workId/like", isLoggedIn, (req, res) => {
    User.findById(req.user._id)
        .then((foundUser) => {
            Work.findByIdAndUpdate(
                req.params.workId,
                {
                    $push: { likes: foundUser._id },
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

//UNLIKE
router.get("/explore/:workId/unlike", isLoggedIn, (req, res) => {
    User.findById(req.user._id)
        .then((foundUser) => {
            console.log("PARAMSSS", req.params);
            Work.findByIdAndUpdate(
                req.params.workId,
                {
                    $pull: { likes: foundUser._id },
                },
                { new: true }
            )
                .then((likedPhoto) => {
                    User.findByIdAndUpdate(req.user._id, {
                        $pull: { likes: likedPhoto._id },
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

// DELETE WORK

router.get("/:workId/delete", isLoggedIn, (req, res) => {
    Work.findByIdAndDelete(req.params.workId)
        .populate("owner")
        .then((foundWork) => {
            console.log("DELETE WORK: ", foundWork);
            User.findByIdAndUpdate(foundWork.owner._id, {
                $pull: { likes: foundWork._id },
            })
                .then((response) => {
                    res.json(true);
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

module.exports = router;
