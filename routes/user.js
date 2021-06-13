const router = require("express").Router();

const User = require("../models/User.model");

const isLoggedIn = require("../middleware/isLoggedIn");

const upload = require("../middleware/cloudinary");

// GET USER PROFILE

router.get(`/`, isLoggedIn, (req, res) => {
    console.log("RERE: ", req.params);
    User.findOne({ username: req.params.username }).then((foundUser) => {
        if (!foundUser) {
            return res.status(404).json({ errMessage: "User doesn't exist" });
        }
        return res.json({ user: foundUser }).catch((err) => {
            console.log(err);
            res.json(500).json({ errorMessage: err.message });
        });
    });
});

// UPDATE USER PROFILE

router.put(`/update`, isLoggedIn, (req, res) => {
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

module.exports = router;
