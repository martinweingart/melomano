const joi = require("joi");
const express = require("express");
const router = express.Router();
const db = require("../../db");
const { validateQuery, decodeId } = require("../../utils");

const querySchema = joi.object({
  qname: joi.string(),
});

router.get("/", (req, res) => {
  if (req.query) {
    validateQuery(querySchema, req.query, res);
  }

  res.json(db.playlists.getPlaylists(req.query));
});

router.get("/:id", (req, res) => {
  const playlist = db.playlists.getPlaylistByName(decodeId(req.params.id));

  if (playlist) {
    res.status(200).json(playlist);
  } else {
    res.status(404).json();
  }
});

router.get("/:id/tracks", (req, res) => {
  res.json(db.playlists.getTracksByPlaylist(decodeId(req.params.id)));
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

router.put("/:id", (req, res) => {
  const playlist = db.playlists.getPlaylistByName(decodeId(req.params.id));

  if (playlist) {
    playlist.tracks = req.body.tracks;
    db.playlists.updatePlaylist(playlist);
    res.status(200).json();
  } else {
    res.status(404).json();
  }

  res.status(200).json();
});

router.delete("/:id", (req, res) => {
  const playlist = db.playlists.getPlaylistByName(decodeId(req.params.id));

  if (playlist) {
    db.playlists.removePlaylist(decodeId(req.params.id));
    res.status(200).json();
  } else {
    res.status(404).json();
  }
});

module.exports = router;
