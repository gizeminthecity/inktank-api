const router = require("express").Router();
const Artist = require("../models/Artist.model");

router.get("/", (req, res) => {
    Artist.find({})
        .then((allArtists) => {
            console.log(allArtists);
            res.json(allArtists);
        })
        .catch((err) => {
            console.error(err);
        });
});

router.get("/:artistId", (req, res) => {
    Artist.findById(req.params.artistId)
        .then((artist) => {
            res.json(artist);
        })
        .catch((err) => {
            console.error(err);
        });
});
module.exports = router;
