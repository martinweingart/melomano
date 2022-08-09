const crypto = require("crypto");
const { existsSync, writeFileSync } = require("fs");
const fs = require("fs").promises;
const path = require("path");
const mime = require("mime-types");
const db = require("../db");
const { parseFile } = require("../parser");
const { getFileExtension, isExtensionValid } = require("../utils");
const logger = require("../logger");
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
  const scanId = Date.now();

  logger.info(
    { time: new Date().toISOString(), scan_id: scanId },
    "Scan started"
  );

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
          logger.error({ error }, "Error reading audio file stats");
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

          if (!fileDB || fileDB.mtime != stat.mtime.toISOString()) {
            try {
              const { picture, ...data } = await parseFile(filePath);

              const hasArt = picture && picture.length > 0;
              let albumArtFilename;

              if ((!fileDB || !fileDB.album_art_filename) && hasArt) {
                try {
                  albumArtFilename = saveAlbumArt(picture[0]);
                } catch (error) {
                  logger.error({ error }, "Error saving album art");
                }
              }

              filesCollection.insert({
                filepath: filePath,
                scan_id: scanId,
                mtime: stat.mtime,
                album_art_filename: albumArtFilename,
                ...data,
              });
            } catch (error) {
              logger.error(
                { error },
                "Error while parsing audio file metadata"
              );
              continue;
            }
          } else {
            fileDB.scan_id = scanId;
            filesCollection.update(fileDB);
          }
        }
      }
    } catch (error) {
      logger.error({ error }, "Error reading directory");
    }
  }

  await walk(directory);

  //Remove old files
  filesCollection
    .chain()
    .find({ scan_id: { $ne: scanId } })
    .remove();

  try {
    await db.save();
  } catch (error) {
    logger.error("Error trying to save database");
  }

  logger.info(
    { time: new Date().toISOString(), scan_id: scanId },
    "Scan finished"
  );
};
