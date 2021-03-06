var bunyan, bunyanOptions, logger, fileName, fs, path, paths;

bunyan = require('bunyan');
paths = require('./paths.js');
fs = require('fs');
path = require('path');

if(!fs.existsSync('logs')){
  fs.mkdirSync('logs', '0766', function(err){
    if(err){
      console.log(err);
    }
  });
}

var date = new Date();
fileName = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

bunyanOptions = {
  name: 'yodel',
  streams: [
    {
      level: 'info',
      stream: process.stdout
    }, {
      level: 'debug',
      type: 'rotating-file',
      path: path.join(paths.logs, fileName + '.log'),
      period: '1d',
      count: 3
    }
  ],
  serializers: bunyan.stdSerializers,
  src: true
};

logger = bunyan.createLogger(bunyanOptions);

module.exports = logger;
