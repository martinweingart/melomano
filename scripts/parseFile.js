const mm = require("music-metadata");

(async function () {
  const metadata = await mm.parseFile(process.argv[2]);
  console.log(metadata);
})();
