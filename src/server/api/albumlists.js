const joi = require("joi");
const express = require("express");
const router = express.Router();
const db = require("../../db");
const { validateQuery } = require("../../utils");

const querySchema = joi.object({
  qname: joi.string(),
});

router.get("/", (req, res) => {
  if (req.query) {
    validateQuery(querySchema, req.query, res);
  }

  res.json(db.albumlists.getAlbumlists(req.query));
});

router.get("/:name", (req, res) => {
  const albumlist = db.albumlists.getAlbumlistByName(req.params.name);

  if (albumlist) {
    const albums = albumlist.albums.map((a) => db.files.getAlbumById(a));
    res.status(200).json({
      name: albumlist.name,
      albums,
    });
  } else {
    res.status(404).json();
  }
});

router.get("/:name/albums", (req, res) => {
  res.json(db.albumlists.getTracksByAlbumlist(req.params.name));
});

router.post("/", (req, res) => {
  const albumlist = db.albumlists.getAlbumlistByName(req.body.name);

  if (albumlist) {
    res.status(409).json({
      message: "The albumlist already exists",
    });
  } else {
    db.albumlists.addAlbumlist(req.body.name, req.body.albums || []);
    res.status(201).json(req.body);
  }
});

router.put("/:name", (req, res) => {
  const albumlist = db.albumlists.getAlbumlistByName(req.body.name);

  if (albumlist) {
    albumlist.albums = req.body.albums;
    db.albumlists.updateAlbumlist(albumlist);
    res.status(200).json();
  } else {
    res.status(404).json();
  }

  res.status(200).json();
});

router.delete("/:name", (req, res) => {
  const albumlist = db.albumlists.getAlbumlistByName(req.params.name);

  if (albumlist) {
    db.albumlists.removeAlbumlist(albumlist.name);
    res.status(200).json();
  } else {
    res.status(404).json();
  }
});

module.exports = router;
