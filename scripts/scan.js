const db = require("../src/db");
const { start } = require("../src/scanner");
const config = require("../config");

async function main() {
  await db.init();

  for (let folder of config.folders) {
    await start(folder);
  }

  process.exit(1);
}

main();
