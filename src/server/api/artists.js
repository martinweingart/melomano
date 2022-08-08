const joi = require("joi");
const express = require("express");
const router = express.Router();
const db = require("../../db");
const { validateQuery, decodeId } = require("../../utils");

const querySchema = joi.object({
  qname: joi.string(),
  limit: joi.number(),
  offset: joi.number(),
});

router.get("/", (req, res) => {
  if (req.query) {
    validateQuery(querySchema, req.query, res);
  }

  const artists = db.files.getArtists(req.query);
  res.json(artists);
});

router.get("/:id", (req, res) => {
  const artist = db.files.getArtistByName(decodeId(req.params.id));

  if (!artist) {
    res.status(404).send();
  } else {
    res.json(artist);
  }
});

router.get("/:id/tracks", (req, res) => {
  const artist = db.files.getArtistByName(decodeId(req.params.id));

  if (!artist) {
    res.status(404).send();
  } else {
    res.json(db.files.getTracksByArtist(decodeId(req.params.id)));
  }
});

module.exports = router;
