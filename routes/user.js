const router = require("express").Router();

const Session = require("../models/Session.model");
const User = require("../models/User.model");
const Work = require("../models/Work.model");

const isLoggedIn = require("../middleware/isLoggedIn");

const upload = require("../middleware/cloudinary");

// GET USER PROFILE

router.get(`/:username`, isLoggedIn, (req, res) => {
    User.findOne({
        username: req.params.username,
    })
        .populate("works")
        .then((foundUser) => {
            console.log(foundUser);
            if (!foundUser) {
                return res.status(400).json({
                    errorMessage: "There's no user with this username!",
                    key: "username",
                });
            }
            res.json({ user: foundUser });
        })
        .catch((err) => {
            console.log(err);
            res.json(500).json({ errorMessage: err.message });
        });
});

// UPDATE USER PROFILE

router.put(`/:username/update`, isLoggedIn, (req, res) => {
    const { username, email } = req.body;

    // if (username.length < 8) {
    // }

    // if (email.length < 8) {
    // }

    User.find({ $or: [{ username }, { email }] }).then((allUsers) => {
        const notUser = allUsers.filter(
            //Filtering all users
            (el) => el._id.toString() !== req.user._id.toString()
        );
        if (notUser.length) {
            //  no update
            return res.status(400).json({
                errorMessage: "Username or email is already taken.",
            });
        }

        User.findByIdAndUpdate(
            req.user._id,
            { username, email },
            { new: true }
        ).then((updatedUser) => {
            res.json({ user: updatedUser });
        });
    });
});

// UPDATE PROFILE PHOTO

router.post("/update-photo", isLoggedIn, upload.single("photo"), (req, res) => {
    const photo = req.file.path;
    const id = req.user._id;

    User.findByIdAndUpdate(id, { photo }, { new: true })
        .then((foundUser) => {
            console.log(foundUser);

            res.json({
                photoFromServer: photo,
                message: "Photo Uploaded successfully",
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ errorMessage: err.message });
        });
});

// DELETE USER

router.delete("/delete", isLoggedIn, (req, res) => {
    User.findByIdAndDelete(req.user._id)
        .then((foundUser) => {
            console.log(foundUser);
            Session.findByIdAndDelete(req.headers.authorization).then(() => {
                res.json(true);
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ errorMessage: err.message });
        });
});

// ADD WORK

router.post(
    "/:username/add-work",
    isLoggedIn,
    upload.single("photo"),
    (req, res) => {
        const photo = req.file.path;
        const { caption } = req.body;

        Work.create({
            caption,
            photo,
            owner: req.user._id,
        })
            .then((createdPost) => {
                User.findByIdAndUpdate(
                    req.user._id,
                    {
                        $addToSet: { works: createdPost._id },
                    },
                    { new: true }
                )
                    .populate("works")
                    .then((updatedUser) => {
                        res.json({ user: updatedUser });
                    });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({ errorMessage: err.message });
            });
    }
);

module.exports = router;
