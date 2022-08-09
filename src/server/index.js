const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const db = require("../db");
const api = require("./api");
const media = require("./media");
const config = require("../../config");
const logger = require("../logger");

module.exports.start = async function () {
  try {
    await db.init();
  } catch (error) {
    logger.error(error);
  }

  try {
    app.use(cors());
    app.use(bodyParser.json());

    app.use("/media", media);
    app.use("/api", api);

    app.use("/", express.static(path.join(__dirname, "../..", "webapp/build")));

    app.use((error, req, res, next) => {
      logger.error({
        errorStack: error.stack,
        request: {
          path: req.path,
          method: req.method,
          params: req.params,
          query: req.query,
          body: req.body,
        },
      });
      res.status(500).send("Internal Server Error");
    });

    app.listen(config.port, config.host, () => {
      logger.info(
        `Music stream app listening on http://${config.host}:${config.port}`
      );
    });
  } catch (error) {
    logger.error({ error }, "Error while starting server");
  }
};
