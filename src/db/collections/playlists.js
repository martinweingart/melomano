const db = require("../index");
const { encodeName } = require("../../utils");

module.exports.getPlaylists = function (query) {
  const playlistsCollection = db.getCollection("playlists");

  if (!playlistsCollection) return [];

  const dbQueryObj = {};

  if (query) {
    if (query.qname) {
      dbQueryObj.name = { $regex: [query.qname, "i"] };
    }
  }

  const results = playlistsCollection
    .find(dbQueryObj)
    .map((o) => ({ id: encodeName(o.name), name: o.name }));

  return results;
};

module.exports.getPlaylistByName = function (name) {
  const playlistsCollection = db.getCollection("playlists");

  if (!playlistsCollection) return null;

  return playlistsCollection.findOne({ name });
};

module.exports.getTracksByPlaylist = function (name) {
  const playlistsCollection = db.getCollection("playlists");

  if (!playlistsCollection) return [];

  const playlist = playlistsCollection.findOne({ name: name });

  if (!playlist) return [];

  return playlist.tracks;
};

module.exports.addPlaylist = function (name, tracks) {
  const playlistsCollection = db.getCollection("playlists");

  playlistsCollection.insert({
    name,
    tracks,
  });
};

module.exports.updatePlaylist = function (playlist) {
  const playlistsCollection = db.getCollection("playlists");
  playlistsCollection.update(playlist);
};

module.exports.removePlaylist = function (name) {
  const playlistsCollection = db.getCollection("playlists");
  playlistsCollection.chain().find({ name }).remove();
};
