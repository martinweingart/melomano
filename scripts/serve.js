const { readConfig } = require("../shared/config");
const server = require("../src/server");

(async function main() {
  const config = await readConfig();
  await server.start(config);
  console.log(`Server running at http://${config.host}:${config.port}`);
})();
