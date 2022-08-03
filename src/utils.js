const path = require("path");

const validExtensions = ["mp3", "ape", "flac"];

exports.getFileExtension = function (pathString) {
  return path.extname(pathString).substring(1).toLowerCase();
};

module.exports.isExtensionValid = function (extension) {
  return validExtensions.indexOf(extension) !== -1;
};

module.exports.getRandomNum = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.getAlbumId = function (row) {
  return encodeURIComponent(
    Buffer.from(
      JSON.stringify({
        artist: row.artist,
        name: row.album,
      })
    ).toString("base64")
  );
};

module.exports.getAlbumDataFromId = function (id) {
  const removePadding = id.replace(/\%3D/g, "");
  return JSON.parse(
    decodeURIComponent(Buffer.from(removePadding, "base64").toString())
  );
};

module.exports.validateQuery = function (schema, query, res) {
  const queryValidation = schema.validate(query);
  if (queryValidation.error) {
    res.status(400).json({
      message: "Invalid query parameters",
      description: queryValidation.error.details[0].message,
    });
    return;
  }
};

module.exports.getAlbumArtUrl = function (filename) {
  return filename ? `/images/albums/${filename}` : null;
};

module.exports.getTracksWithId = function (results) {
  return results.map((r) => ({ ...r, id: r["$loki"] }));
};
