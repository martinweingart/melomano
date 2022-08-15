const storage = require("../storage");
const path = require("path");

const logPath = path.join(storage.logs, "melomano.log");
const flogger = require("pino")(logPath);

module.exports = flogger;
