const express = require("express");
const router = express.Router();
const tracks = require("./tracks");
const config = require("../../../config");

router.use("/images/albums", express.static(config.albumArtFolder));
router.use("/tracks", tracks);

module.exports = router;
