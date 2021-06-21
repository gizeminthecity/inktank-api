const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
    res.json("All good in here");
});

// AUTH Routes
const authRoutes = require("./auth");
router.use("/auth", authRoutes);

// Studio Routes
const studioRoutes = require("./studios");
router.use("/studios", studioRoutes);

// User Routes
const userRoutes = require("./user");
router.use("/user", userRoutes);

// Work Routes
const workRoutes = require("./works");
router.use("/works", workRoutes);

//Artist Routes

const artistsRoutes = require("./artists");
router.use("/artists", artistsRoutes);

module.exports = router;
