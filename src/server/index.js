const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const port = 3500;
const db = require("../db");
const api = require("./api");
const media = require("./media");

module.exports.start = async function () {
  await db.init();

  app.use(cors());
  app.use(bodyParser.json());
  app.use("/media", media);
  app.use("/api", api);

  app.listen(port, () => {
    console.log(`Music stream app listening on port ${port}`);
  });
};
