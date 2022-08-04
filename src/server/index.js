const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const db = require("../db");
const api = require("./api");
const media = require("./media");
const config = require("../../config");

module.exports.start = async function () {
  await db.init();

  app.use(cors());
  app.use(bodyParser.json());

  app.use("/media", media);
  app.use("/api", api);

  app.use("/", express.static(path.join(__dirname, "../..", "webapp/build")));

  app.listen(config.port, config.host, () => {
    console.log(
      `Music stream app listening on http://${config.host}:${config.port}`
    );
  });
};
