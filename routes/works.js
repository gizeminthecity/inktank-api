const router = require("express").Router();

const Session = require("../models/Session.model");
const User = require("../models/User.model");
const Work = require("../models/Work.model");

const isLoggedIn = require("../middleware/isLoggedIn");

const upload = require("../middleware/cloudinary");

// ADD WORK

router.post("/add", isLoggedIn, upload.single("photo"), (req, res) => {
    const photo = req.file.path;
    const { caption } = req.body;

    Work.create({
        caption,
        photo,
        owner: req.user._id,
        likes: [req.user_id],
    })
        .then((createdWork) => {
            res.json({ work: createdWork });
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
            res.json(foundWorks);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ errorMessage: err.message });
        });
});

// LIKE

router.put("/like/:workId", isLoggedIn, (req, res) => {
    console.log("workid: ", req.params.workId);
    Work.findOne(req.params.workId).then((foundWork) => {
        console.log("FOUND WORK", foundWork);
    });
});

router.put("/unlike", isLoggedIn, (req, res) => {
    Work.findByIdAndUpdate(
        req.body.workId,
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

module.exports = router;
