const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
    res.json("All good in here");
});

// AUTH Routes
const authRoutes = require("./auth");
router.use("/auth", authRoutes);

// Artist Route
const artistsRouter = require("./artists");
router.use("/artists", artistsRouter);

module.exports = router;
