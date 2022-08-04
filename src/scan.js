const db = require("./db");
const { start } = require("./scanner");
const config = require("../config");

async function main() {
  await db.init();

  for (let folder of config.folders) {
    await start(folder);
  }

  process.exit(1);
}

main();
