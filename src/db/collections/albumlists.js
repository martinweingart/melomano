const db = require("../index");
const { encodeName } = require("../../utils");

module.exports.getAlbumlists = function (query) {
  const albumlistsCollection = db.getCollection("albumlists");

  if (!albumlistsCollection) return [];

  const dbQueryObj = {};

  if (query) {
    if (query.qname) {
      dbQueryObj.name = { $regex: [query.qname, "i"] };
    }
  }

  const results = albumlistsCollection
    .find(dbQueryObj)
    .map((o) => ({ id: encodeName(o.name), name: o.name }));

  return results;
};

module.exports.getAlbumlistByName = function (name) {
  const albumlistsCollection = db.getCollection("albumlists");

  if (!albumlistsCollection) return null;

  return albumlistsCollection.findOne({ name });
};

module.exports.getTracksByAlbumlist = function (name) {
  const albumlistsCollection = db.getCollection("albumlists");

  if (!albumlistsCollection) return [];

  const albumlist = albumlistsCollection.findOne({ name: name });

  if (!albumlist) return [];

  return albumlist.albums;
};

module.exports.addAlbumlist = function (name, albums) {
  const albumlistsCollection = db.getCollection("albumlists");

  albumlistsCollection.insert({
    name,
    albums,
  });
};

module.exports.updateAlbumlist = function (albumlist) {
  const albumlistsCollection = db.getCollection("albumlists");
  albumlistsCollection.update(albumlist);
};

module.exports.removeAlbumlist = function (name) {
  const albumlistsCollection = db.getCollection("albumlists");
  albumlistsCollection.chain().find({ name }).remove();
};
