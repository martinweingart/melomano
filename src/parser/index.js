const mm = require("music-metadata");

module.exports.parseFile = async function (filepath) {
  const metadata = await mm.parseFile(filepath);
  return {
    artist:
      metadata.common.artist || metadata.common.albumartist || "Unknown artist",
    album: metadata.common.album || "Unknown album",
    title: metadata.common.title || "Unknown title",
    track: metadata.common.track.no,
    year: metadata.common.year,
    genre: metadata.common.genre,
    sampleRate: metadata.format.sampleRate,
    bitrate: metadata.format.bitrate,
    duration: metadata.format.duration,
    codec: metadata.format.codec,
    lossles: metadata.format.lossless,
    picture: metadata.common.picture,
  };
};
