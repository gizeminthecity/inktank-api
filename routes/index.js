const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
    res.json("All good in here");
});

// AUTH Routes
const authRoutes = require("./auth");
router.use("/auth", authRoutes);

// Studio Routes
const studiosRouter = require("./studios");
router.use("/studios", studiosRouter);

// User Routes
const userRoutes = require("./user");
router.use("/user", userRoutes);

module.exports = router;
