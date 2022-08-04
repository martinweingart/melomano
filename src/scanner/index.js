const crypto = require("crypto");
const { existsSync, writeFileSync } = require("fs");
const fs = require("fs").promises;
const path = require("path");
const mime = require("mime-types");
const db = require("../db");
const { parseFile } = require("../parser");
const { getFileExtension, isExtensionValid } = require("../utils");
const config = require("../../config");

function saveAlbumArt(picture) {
  const hash = crypto
    .createHash("md5")
    .update(picture.data.toString("utf-8"))
    .digest("hex");

  const filename = hash + "." + mime.extension(picture.format);

  if (!existsSync(path.join(config.albumArtFolder, filename))) {
    writeFileSync(path.join(config.albumArtFolder, filename), picture.data);
  }

  return filename;
}

module.exports.start = async function (directory) {
  console.log("Starting scan: ", new Date().toISOString());

  const scanId = Date.now();
  const filesCollection = db.getCollection("files");

  async function walk(directory) {
    try {
      const files = await fs.readdir(directory);

      for (const file of files) {
        const filePath = path.join(directory, file);
        let stat;

        try {
          stat = await fs.stat(filePath);
        } catch (error) {
          continue;
        }

        if (stat.isDirectory()) {
          await walk(filePath);
        } else {
          const extension = getFileExtension(file);

          if (!isExtensionValid(extension)) {
            continue;
          }

          const fileDB = filesCollection.findOne({
            filepath: { $eq: filePath },
          });

          if (!fileDB) {
            const { picture, ...data } = await parseFile(filePath);

            const hasArt = picture && picture.length > 0;
            let albumArtFilename;

            if (hasArt) {
              try {
                albumArtFilename = saveAlbumArt(picture[0]);
              } catch (e) {
                console.error(e);
                console.error("Cant save album picture: ", filePath);
              }
            }

            filesCollection.insert({
              filepath: filePath,
              scan_id: scanId,
              mtime: stat.mtime,
              album_art_filename: albumArtFilename,
              ...data,
            });
          } else {
            filesCollection.update({ ...fileDB, scan_id: scanId });
          }
        }
      }
    } catch (e) {
      console.error(e);
      console.error("Cant read directory: ", directory);
    }
  }

  await walk(directory);

  //Remove old files
  filesCollection
    .chain()
    .find({ scan_id: { $ne: scanId } })
    .remove();

  console.log("Finish scan: ", new Date().toISOString());
};
