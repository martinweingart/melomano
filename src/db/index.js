const path = require("path");
const loki = require("lokijs");
const config = require("../../config");

let db;

let collections = {
  files: null,
  playlists: null,
  albumlists: null,
};

module.exports.init = async function () {
  return new Promise((resolve, reject) => {
    db = new loki(path.join(config.dbStorage, "melomano.db"), {
      autosave: true,
      autosaveInterval: 5000,
    });

    db.loadDatabase({}, (err) => {
      if (err) {
        reject("Error loading database");
      }

      for (const name in collections) {
        collections[name] = db.getCollection(name);

        if (!collections[name]) {
          collections[name] = db.addCollection(name);
        }
      }

      resolve();
    });
  });
};

module.exports.getCollection = function (name) {
  return collections[name];
};

module.exports.files = require("./collections/files");
module.exports.playlists = require("./collections/playlists");
module.exports.albumlists = require("./collections/albumlists");
