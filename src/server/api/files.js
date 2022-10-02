const crypto = require("crypto");
const path = require("path");
const { existsSync, writeFileSync } = require("fs");
const express = require("express");
const router = express.Router();
const mime = require("mime-types");
const logger = require("../../logger");
const storage = require("../../storage");
const db = require("../../db");
const { parseFile } = require("../../parser");
const { getFileExtension, isExtensionValid } = require("../../utils");

function saveAlbumArt(picture) {
  const hash = crypto
    .createHash("md5")
    .update(picture.data.toString("utf-8"))
    .digest("hex");

  const filename = hash + "." + mime.extension(picture.format);

  if (!existsSync(path.join(storage.albumArtFolder, filename))) {
    writeFileSync(path.join(storage.albumArtFolder, filename), picture.data);
  }

  return filename;
}

router.post("/add", async (req, res) => {
  const filePath = req.body.filePath;
  const scanId = req.body.scanId;
  const mtime = req.body.mtime;

  const extension = getFileExtension(filePath);

  if (!isExtensionValid(extension)) {
    res.status(400).send();
    return;
  }

  const filesCollection = db.getCollection("files");

  let fileDB = filesCollection.findOne({
    filepath: { $eq: filePath },
  });

  if (!fileDB || fileDB.mtime != mtime || !fileDB.album_art_filename) {
    try {
      const { picture, ...data } = await parseFile(filePath);

      const hasArt = picture && picture.length > 0;
      let albumArtFilename;

      if ((!fileDB || !fileDB.album_art_filename) && hasArt) {
        try {
          albumArtFilename = saveAlbumArt(picture[0]);
        } catch (error) {
          logger.error({ error: error.stack }, "Error saving album art");
        }
      }

      fileDB = filesCollection.insert({
        filepath: filePath,
        scan_id: scanId,
        mtime,
        album_art_filename: albumArtFilename,
        ...data,
      });
    } catch (error) {
      logger.error(
        { file: filePath },
        "Error while parsing audio file metadata"
      );
      res.status(500).send();
      return;
    }
  } else {
    fileDB.scan_id = scanId;
    filesCollection.update(fileDB);
  }

  res.status(200).send(fileDB);
});

router.post("/clean", async (req, res) => {
  const scanId = req.body.scanId;
  const filesCollection = db.getCollection("files");
  const playlistsCollection = db.getCollection("playlists");
  const albumlistsCollection = db.getCollection("albumlists");

  filesCollection
    .chain()
    .find({ scan_id: { $ne: scanId } })
    .remove();

  const playlists = playlistsCollection.find();
  for (let playlist of playlists) {
    playlist.tracks = playlist.tracks.filter(
      (t) => db.files.getTrackById(t.id) !== null
    );
    playlistsCollection.update(playlist);

    if (!playlist.tracks || playlist.tracks.length === 0) {
      playlistsCollection.remove(playlist.$loki);
    }
  }

  const albumlists = albumlistsCollection.find();
  for (let albumlist of albumlists) {
    albumlist.albums = albumlist.albums.filter(
      (id) => id && db.files.getAlbumById(id) !== null
    );
    albumlistsCollection.update(albumlist);

    if (!albumlist.albums || albumlist.albums.length === 0) {
      albumlistsCollection.remove(albumlist.$loki);
    }
  }

  db.save();

  res.status(200).send();
});

module.exports = router;
