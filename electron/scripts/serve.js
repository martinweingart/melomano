const { readConfig } = require("../shared/config");
const server = require("../src/server");

(async function main() {
  process.send("Starting");
  const config = await readConfig();

  try {
    await server.start(config);
    process.send("Running");
  } catch (e) {
    process.send("Failed");
  }
})();
