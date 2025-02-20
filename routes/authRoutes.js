const express = require("express");
const { signup, login, getUserDetails } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user", getUserDetails);

module.exports = router;
