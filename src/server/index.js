const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const db = require("../db");
const api = require("./api");
const media = require("./media");
const logger = require("../logger");

let server;

module.exports.start = function (config) {
  return new Promise(async (resolve, reject) => {
    try {
      await db.init();
    } catch (error) {
      logger.error(error);
      reject(error);
    }

    try {
      app.use(cors());
      app.use(bodyParser.json());

      app.use("/media", media);
      app.use("/api", api);

      app.use("/", express.static(path.join(__dirname, "../..", "webapp")));

      app.get(["/favicon.ico", "main.js", "*.jpg"], (req, res) => {
        res.sendFile(
          path.join(__dirname, "../../webapp", req.path),
          (error) => {
            if (error) {
              logger.error("Error serving favicon");
              res.status(404).send("Favicon not found");
            }
          }
        );
      });

      app.get(["/", "/*"], (req, res) => {
        res.sendFile(
          path.join(__dirname, "../../webapp", "index.html"),
          (error) => {
            if (error) {
              logger.error("Error serving webapp");
              res.status(500).send("Internal Server Error");
            }
          }
        );
      });

      app.use((error, req, res) => {
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

      server = app.listen(config.port, config.host, () => {
        logger.info(
          `Music stream app listening on http://${config.host}:${config.port}`
        );
        setTimeout(() => resolve(), 1000);
      });

      server.on("error", (error) => {
        logger.error({ error: error.stack }, "Error while starting server");
        reject(error);
      });
    } catch (error) {
      logger.error({ error: error.stack }, "Error while starting server");
      reject(error);
    }
  });
};
