const joi = require("joi");
const express = require("express");
const router = express.Router();
const db = require("../../db");
const { validateQuery } = require("../../utils");

const querySchema = joi.object({
  qname: joi.string(),
  artist: joi.string(),
  limit: joi.number(),
  offset: joi.number(),
});

router.get("/", (req, res) => {
  if (req.query) {
    validateQuery(querySchema, req.query, res);
  }

  res.json(db.files.getAlbums(req.query));
});

router.get("/random", (_req, res) => {
  const album = db.files.getAlbumRandom();
  if (!album) {
    res.status(404).send();
  } else {
    res.json(album);
  }
});

router.get("/recent", (_req, res) => {
  res.json(db.files.getAlbumsRecent());
});

router.get("/:id", (req, res) => {
  const album = db.files.getAlbumById(req.params.id);

  if (!album) {
    res.status(404).send();
  } else {
    res.json(album);
  }
});

router.get("/:id/tracks", (req, res) => {
  res.json(db.files.getTracksByAlbum(req.params.id));
});

module.exports = router;
