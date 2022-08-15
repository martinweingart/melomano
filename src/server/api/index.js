const express = require("express");
const router = express.Router();

const artists = require("./artists");
const albums = require("./albums");
const files = require("./files");
const genres = require("./genres");
const playlists = require("./playlists");
const albumlists = require("./albumlists");

router.use("/artists", artists);
router.use("/albums", albums);
router.use("/albumlists", albumlists);
router.use("/files", files);
router.use("/genres", genres);
router.use("/playlists", playlists);

module.exports = router;
