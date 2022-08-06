const joi = require("joi");
const express = require("express");
const router = express.Router();
const db = require("../../db");
const { validateQuery } = require("../../utils");

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

router.get("/:name", (req, res) => {
  const artist = db.files.getArtistByName(req.params.name);

  if (!artist) {
    res.status(404).send();
  } else {
    res.json(artist);
  }
});

router.get("/:name/tracks", (req, res) => {
  res.json(db.files.getTracksByArtist(req.params.name));
});

module.exports = router;
