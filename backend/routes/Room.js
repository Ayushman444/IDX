const express = require("express");
const {join, giveAccess, takeAccess, leaveRoom , createRoom} = require("../controllers/Room")

const router = express.Router();

router.post("/join", join);
router.post("/giveaccess", giveAccess);
router.post("/takeaccess", takeAccess);
router.post("/leave",leaveRoom);
router.post("/createroom", createRoom);


module.exports = router;
