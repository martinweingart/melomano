const config = require("../../config");
const path = require("path");

const logPath = path.join(config.logs, "melomano.log");
const flogger = require("pino")(logPath);

module.exports = flogger;
