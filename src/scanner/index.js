const fs = require("fs").promises;
const path = require("path");
const axios = require("axios");
const logger = require("../logger");

module.exports.scanDir = async function (directory, scanId, apiUrl) {
  async function walk(directory) {
    try {
      const files = await fs.readdir(directory);

      for (const file of files) {
        const filePath = path.join(directory, file);
        let stat;

        try {
          stat = await fs.stat(filePath);
        } catch (error) {
          logger.error(
            { error: error.stack },
            "Error reading audio file stats"
          );
          continue;
        }

        if (stat.isDirectory()) {
          await walk(filePath);
        } else {
          try {
            await axios.post(apiUrl, {
              scanId,
              filePath,
              mtime: stat.mtime.toISOString(),
            });
          } catch (e) {}
        }
      }
    } catch (error) {
      logger.error({ error: error.stack }, "Error reading directory");
    }
  }

  await walk(directory);
};

module.exports.start = async function (config) {
  const apiUrl = `http://${config.host}:${config.port}/api/files`;
  const apiAddFileUrl = apiUrl + "/add";
  const scanId = Date.now();

  logger.info(
    { time: new Date().toISOString(), scan_id: scanId },
    "Scan started"
  );

  for (let directory of config.folders) {
    await module.exports.scanDir(directory, scanId, apiAddFileUrl);
  }

  try {
    await axios.post(apiUrl + "/clean", { scanId });
  } catch (error) {
    logger.error({ error: error.stack }, "Error cleaning files database");
  }

  logger.info(
    { time: new Date().toISOString(), scan_id: scanId },
    "Scan finished"
  );
};
