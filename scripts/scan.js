const { readConfig } = require("../shared/config");
const { start } = require("../src/scanner");

(async function () {
  const config = await readConfig();
  if (config.folders.length === 0) {
    console.log("Folders is empty in storage/config.json");
  } else {
    await start(config);
    console.log("Scan finished!");
  }
})();
