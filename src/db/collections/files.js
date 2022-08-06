const db = require("../index");
const {
  getAlbumDataFromId,
  getAlbumArtUrl,
  getTracksWithId,
  getAlbumId,
  getRandomNum,
} = require("../../utils");

module.exports.getArtists = function (query) {
  const filesCollection = db.getCollection("files");

  if (!filesCollection) {
    return [];
  }

  const artists = [];

  const dbQueryObj = {};

  if (query) {
    if (query.qname) {
      dbQueryObj.artist = { $regex: [query.qname, "i"] };
    }
  }

  const results = filesCollection.find(dbQueryObj);

  for (let row of results) {
    if (artists.indexOf(row.artist) === -1) {
      artists.push(row.artist);
    }
  }

  const offset = query?.offset ? +query.offset : 0;
  const limit = query?.limit ? offset + +query.limit : undefined;

  return {
    total: artists.length,
    data: artists.slice(offset, limit).map((name) => ({ name })),
  };
};

module.exports.getArtistByName = function (name) {
  const filesCollection = db.getCollection("files");

  if (!filesCollection) return null;

  const results = filesCollection.find({
    artist: { $regex: [`^${name}$`, "i"] },
  });

  const albums = {};

  for (let row of results) {
    const albumObj = {
      artist: row.artist,
      name: row.album,
      year: row.year,
      image: getAlbumArtUrl(row.album_art_filename),
    };

    const albumId = getAlbumId(row);

    if (!albums[albumId]) {
      albums[albumId] = albumObj;
    }
  }

  const albumList = Object.keys(albums).map((id) => ({
    id,
    ...albums[id],
  }));

  return {
    name: albumList[0].artist,
    albums: albumList,
  };
};

module.exports.getAlbums = function (query) {
  const filesCollection = db.getCollection("files");

  if (!filesCollection) return [];

  const dbQueryObj = {};

  if (query) {
    if (query.qname) {
      dbQueryObj.album = { $regex: [query.qname, "i"] };
    }
    if (query.artist) {
      dbQueryObj.artist = { $regex: [`^${query.artist}$`, "i"] };
    }
  }

  const results = filesCollection.find(dbQueryObj);
  const albums = {};

  for (let row of results) {
    const albumObj = {
      artist: row.artist,
      name: row.album,
      year: row.year,
      image: getAlbumArtUrl(row.album_art_filename),
    };

    const albumId = getAlbumId(row);

    if (!albums[albumId]) {
      albums[albumId] = albumObj;
    }
  }

  const response = Object.keys(albums).map((id) => ({
    id,
    ...albums[id],
  }));

  const offset = query?.offset ? +query.offset : 0;
  const limit = query?.limit ? offset + +query.limit : undefined;

  return {
    total: response.length,
    data: response.slice(offset, limit),
  };
};

module.exports.getAlbumById = function (id) {
  const filesCollection = db.getCollection("files");

  if (!filesCollection) return null;

  const albumObj = getAlbumDataFromId(id);

  const results = filesCollection.find({
    album: { $regex: [`^${albumObj.name}$`, "i"] },
    artist: { $regex: [`^${albumObj.artist}$`, "i"] },
  });

  if (!results || results.length === 0) return null;

  const genres = [];
  let albumArt;
  for (let row of results) {
    if (!albumArt && row.album_art_filename) {
      albumArt = row.album_art_filename;
    }

    if (row.genre && row.genre.length > 0) {
      for (let genre of row.genre) {
        if (genres.indexOf(genre) === -1) {
          genres.push(genre);
        }
      }
    }
  }

  return {
    name: results[0].album,
    artist: results[0].artist,
    year: results[0].year,
    genres: genres,
    tracks: getTracksWithId(results),
    image: getAlbumArtUrl(albumArt),
  };
};

module.exports.getAlbumRandom = function () {
  const filesCollection = db.getCollection("files");

  if (!filesCollection) return null;

  const albums = module.exports.getAlbums({});
  const randomIndex = getRandomNum(0, albums.total);

  return albums.data[randomIndex];
};

module.exports.getAlbumsRecent = function () {
  const filesCollection = db.getCollection("files");

  if (!filesCollection) return [];

  const albums = {};

  const results = filesCollection
    .chain()
    .find()
    .simplesort("mtime", { desc: true })
    .limit(500)
    .data();

  for (let row of results) {
    const albumObj = {
      artist: row.artist,
      name: row.album,
      year: row.year,
      mtime: row.mtime,
      image: getAlbumArtUrl(row.album_art_filename),
    };

    const albumId = getAlbumId(row);

    if (!albums[albumId]) {
      albums[albumId] = albumObj;
    }
  }

  const response = Object.keys(albums).map((id) => ({
    id,
    ...albums[id],
  }));

  return response;
};

module.exports.getGenres = function (query) {
  const filesCollection = db.getCollection("files");

  if (!filesCollection) return [];

  const genres = [];
  const dbQueryObj = {};

  if (query) {
    if (query.qname) {
      dbQueryObj.genre = { $contains: query.qname };
    }
  }

  const results = filesCollection.find(dbQueryObj);

  for (let row of results) {
    if (row.genre && row.genre.length > 0) {
      for (let genre of row.genre) {
        if (genres.indexOf(genre) === -1) {
          genres.push(genre);
        }
      }
    }
  }

  const offset = query?.offset ? +query.offset : 0;
  const limit = query?.limit ? offset + +query.limit : undefined;

  return {
    total: genres.length,
    data: genres.slice(offset, limit).map((name) => ({ name })),
  };
};

module.exports.getGenreByName = function (name) {
  const filesCollection = db.getCollection("files");

  if (!filesCollection) return null;

  const results = filesCollection.find({
    genre: { $contains: name },
  });

  const albums = {};

  for (let row of results) {
    const albumObj = {
      artist: row.artist,
      name: row.album,
      year: row.year,
      image: getAlbumArtUrl(row.album_art_filename),
    };

    const albumId = getAlbumId(row);

    if (!albums[albumId]) {
      albums[albumId] = albumObj;
    }
  }

  const albumList = Object.keys(albums).map((id) => ({
    id,
    ...albums[id],
  }));

  return {
    name: name,
    albums: albumList,
  };
};

module.exports.getTracksByArtist = function (artistName) {
  const filesCollection = db.getCollection("files");

  if (!filesCollection) return [];

  const results = filesCollection.find({
    artist: { $regex: [`^${artistName}$`, "i"] },
  });

  return getTracksWithId(results);
};

module.exports.getTracksByAlbum = function (albumId) {
  const filesCollection = db.getCollection("files");

  if (!filesCollection) return [];

  const albumObj = getAlbumDataFromId(albumId);

  const results = filesCollection
    .chain()
    .find({
      album: { $regex: [`^${albumObj.name}$`, "i"] },
      artist: { $regex: [`^${albumObj.artist}$`, "i"] },
    })
    .simplesort("track")
    .data();

  if (!results || results.length === 0) return [];

  return getTracksWithId(results);
};

module.exports.getTracksByGenre = function (genreName) {
  const filesCollection = db.getCollection("files");

  if (!filesCollection) return [];

  const results = filesCollection.find({
    genre: { $contains: genreName },
  });

  return getTracksWithId(results);
};

module.exports.getTrackById = function (id) {
  const filesCollection = db.getCollection("files");

  return filesCollection.findOne({
    $loki: { $eq: id },
  });
};
