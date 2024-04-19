const express = require("express");
const { login, logout, signup } = require("../controllers/Auth.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
// router.post("/forget-password",forgetPassword);
// router.post("/reset-password", resetPassword);

module.exports = router;
