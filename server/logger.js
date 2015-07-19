var bunyan, bunyanOptions, logger, fileName;

bunyan = require("bunyan");
fileName = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-log";

bunyanOptions = {
  name: "yodel",
  streams: [
    {
      level: "info",
      stream: process.stdout
    }, {
      level: "debug",
      type: "rotating-file",
      path: "build/ " + fileName + ".log",
      period: "1d",
      count: 3
    }
  ],
  serializers: bunyan.stdSerializers,
  src: true
};

logger = bunyan.createLogger(bunyanOptions);

module.exports = logger;
