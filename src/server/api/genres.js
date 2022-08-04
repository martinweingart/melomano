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

  const genres = db.files.getGenres(req.query);
  res.json(genres);
});

router.get("/:name", (req, res) => {
  const genre = db.files.getGenreByName(req.params.name);
  if (!genre) {
    res.status(404).send();
  } else {
    res.json(genre);
  }
});

router.get("/:name/tracks", (req, res) => {
  res.json(db.files.getTracksByGenre(req.params.name));
});

module.exports = router;
