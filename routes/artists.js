const router = require("express").Router();
const Artist = require("../models/Artist.model");

router.get("/", (req, res) => {
    Artist.find({}).then((allArtists) => {
        console.log(allArtists);
        res.json(allArtists);
    });
});

module.exports = router;
