var fs = require('fs');
var path = require('path');
var aws = require('aws-sdk');
var s3stream   = require('s3-upload-stream');
var config = require('../config.js');
var logger = require('../logger.js');

var s3UploadStream = s3stream(new aws.S3());
var fsBucketRoot = path.join(__dirname, '..', '..', config.aws.yodelS3Bucket);

// TODO: Likely, this is unnecessary, and we should directly upload images from users to S3:
// http://docs.aws.amazon.com/AmazonS3/latest/dev/UsingHTTPPOST.html
// http://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-authentication-HTTPPOST.html
// http://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-post-example.html
function getFSUploadWriteStream(key) {
  try {
    fs.lstatSync(fsBucketRoot + '/' + username);
  } catch (e) {
    fs.mkdir(fsBucketRoot + '/' + username);
  }

  var stream = fs.createWriteStream(fsBucketRoot + '/' + username + '/' + key);
  stream.on('error', function(error) { logger.error(error); });
  return stream;
}

function getS3UploadWriteStream(key) {
  var upload = s3UploadStream.upload({
    Bucket: config.aws.yodelS3Bucket,
    Key: uploadKey
  });
  upload.on('error', function (error) { logger.error(error); });
  return upload;
}

function getFSReadStream(username, resourceId) {
  return fs.createReadStream(fsBucketRoot + '/' + username + '/' + resourceId);
}

function getS3ReadStream(username, resourceId) {
  var params = {
    Bucket: config.aws.yodelS3bucket,
    Key: username + '/' + resourceId
  };
  return s3.getObject(params).createReadStream();
}

module.exports = {
  getUploadWriteStream: getFSUploadWriteStream,
  getDownloadReadStream: getFSReadStream
};
