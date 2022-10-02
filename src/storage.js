const path = require("path");

module.exports = {
  db: path.join(__dirname, "../storage"),
  logs: path.join(__dirname, "../storage/logs"),
  albumArtFolder: path.join(__dirname, "../storage/images/albums"),
};
