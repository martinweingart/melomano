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

  const genres = db.files.getGenres(req.query);
  res.json(genres);
});

router.get("/:id", (req, res) => {
  const genre = db.files.getGenreByName(decodeId(req.params.id));
  if (!genre) {
    res.status(404).send();
  } else {
    res.json(genre);
  }
});

router.get("/:id/tracks", (req, res) => {
  const name = decodeId(req.params.id);
  const genre = db.files.getGenreByName(name);
  if (!genre) {
    res.status(404).send();
  } else {
    res.json(db.files.getTracksByGenre(name));
  }
});

module.exports = router;
