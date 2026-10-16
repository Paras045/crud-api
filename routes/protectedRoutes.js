
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Every route in this router requires a valid access token.
router.use(authMiddleware);

router.get("/profile", (req, res) => {
    res.status(200).json({
        id: req.user.id,
        email: req.user.email,
        created_at: req.user.created_at
    });
});


router.get("/dashboard", (req, res) => {
    res.status(200).json({
        message: "Welcome to your protected dashboard!",
        user: {
            id: req.user.id,
            email: req.user.email
        }
    });
});


module.exports = router;
