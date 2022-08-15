const express = require("express");
const router = express.Router();
const tracks = require("./tracks");
const storage = require("../../storage");

router.use("/images/albums", express.static(storage.albumArtFolder));
router.use("/tracks", tracks);

module.exports = router;
