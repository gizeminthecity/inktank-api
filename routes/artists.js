const router = require("express").Router();

const User = require("../models/User.model");

const isLoggedIn = require("../middleware/isLoggedIn");

// GET ALL ARTISTS

router.get("/", isLoggedIn, (req, res) => {
    User.find({ role: "Artist" })
        .then((allArtists) => {
            console.log("ALL ARTISTS: ", allArtists);
            res.json(allArtists);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ errorMessage: err.message });
        });
});

module.exports = router;
