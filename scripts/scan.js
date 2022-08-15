const { readConfig } = require("../shared/config");
const { start } = require("../src/scanner");

(async function () {
  let status = "Starting";
  process.send(status);

  process.on("status:get", () => process.send(status));

  try {
    const config = await readConfig();
    status = "Running";
    process.send(status);
    await start(config);
    status = "Finished";
    process.send(status);
  } catch (e) {
    status = "Failed";
    process.send(status);
  }
})();
