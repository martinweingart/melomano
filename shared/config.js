const path = require("path");
const fs = require("fs/promises");
const { existsSync } = require("fs");

const configPath = path.join(__dirname, "../storage/config.json");
let config;

createDefaultConfig = async function () {
  let data = `
    {
      "host": "localhost",
      "port": 3500,
      "folders": []
    }
    `;

  await fs.writeFile(configPath, data);
  config = data;
  return data;
};

module.exports.readConfig = async function () {
  let data;

  if (!existsSync(configPath)) {
    data = await createDefaultConfig();
  }

  try {
    data = await fs.readFile(configPath, "utf-8");
  } catch (error) {}

  if (data) {
    return JSON.parse(data);
  }
};

module.exports.saveConfig = async function (newConfig) {
  await fs.writeFile(configPath, JSON.stringify(newConfig));
  config = newConfig;
};

module.exports.addFolder = async function (path) {
  if (!config) {
    config = await module.exports.readConfig();
  }

  module.exports.saveConfig({
    ...config,
    folders: [...config.folders, path],
  });
};

module.exports.removeFolder = async function (path) {
  if (!config) {
    config = await module.exports.readConfig();
  }

  module.exports.saveConfig({
    ...config,
    folders: config.folders.filter((f) => f !== path),
  });
};
