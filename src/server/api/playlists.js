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

  res.json(db.playlists.getPlaylists(req.query));
});

router.get("/:name", (req, res) => {
  const playlist = db.playlists.getPlaylistByName(req.params.name);

  if (playlist) {
    res.status(200).json(playlist);
  } else {
    res.status(404).json();
  }
});

router.get("/:name/tracks", (req, res) => {
  res.json(db.playlists.getTracksByPlaylist(req.params.name));
});

router.post("/", (req, res) => {
  const playlist = db.playlists.getPlaylistByName(req.body.name);

  if (playlist) {
    res.status(409).json({
      message: "The playlist already exists",
    });
  } else {
    db.playlists.addPlaylist(req.body.name, req.body.tracks || []);
    res.status(201).json(req.body);
  }
});

router.put("/:name", (req, res) => {
  const playlist = db.playlists.getPlaylistByName(req.body.name);

  if (playlist) {
    playlist.tracks = req.body.tracks;
    db.playlists.updatePlaylist(playlist);
    res.status(200).json();
  } else {
    res.status(404).json();
  }

  res.status(200).json();
});

router.delete("/:name", (req, res) => {
  const playlist = db.playlists.getPlaylistByName(req.params.name);

  if (playlist) {
    db.playlists.removePlaylist(req.params.name);
    res.status(200).json();
  } else {
    res.status(404).json();
  }
});

module.exports = router;
