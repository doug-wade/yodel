var aws     = require('aws-sdk');
var crypto  = require('crypto');
var config  = require('../config');
var logger  = require('../logger.js');

/**
 * Creates a controller for creating s3 upload policies to allow end users to upload images to our s3 bucket.
 *
 * @class S3Controller
 * @classdesc A controller for creating s3 upload policies to allow end users to upload images to our s3 bucket.
 */
export class S3UploadController {
  /**
   * Get aws credentials from the provider chain.
   *
   * @todo Refactor this into a helper; it's not S3-specific.
   * @return {Promise} A promise for the [credentials](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Credentials.html).
   */
  _getKeyFromCredentials() {
    return new Promise((resolve, reject) => {
      var diskProvider = new aws.FileSystemCredentials(config.credentialsPath);
      var chain = new aws.CredentialProviderChain();
      chain.providers.push(diskProvider);

      chain.resolve((err, credentials) => {
        if (err) {
          logger.error('Failed to retrieve credentials with error', err);
          reject(err);
        } else {
          resolve(credentials);
        }
      });
    });
  }

  /**
   * Gets the S3 upload policy.
   *
   * @return {Promise} A promise for the s3 policy, as documented in the [ng-s3upload doc](https://github.com/asafdav/ng-s3upload).
   */
  _getPolicy() {
    return new Promise((resolve, reject) => {
      var now = new Date();
      var expiry = now.setUTCHours(now.getUTCHours() + 1);

      var policy = {
        expiration: expiry,
        conditions: [
          { bucket: config.s3Bucket },
          [ 'starts-with', '$key', '' ],
          { acl: 'public-read' },
          [ 'starts-with', '$Content-Type', '' ],
          [ 'content-length-range', 0, 10 * 1024 * 1024 ]
        ]
      };

      try {
        resolve(new Buffer(JSON.stringify(policy).toString('base64')));
      } catch (e) {
        logger.error('Failed to encode policy with error', e);
        reject(e);
      }
    });
  }

  /**
   * Gets the signed version of the s3 upload policy.
   *
   * @return {Promise} A promise for the s3 signature, as documented in the [ng-s3upload doc](https://github.com/asafdav/ng-s3upload).
   */
  _getSignature(policy, secretKey) {
    return new Promise((resolve, reject) => {
      try {
        var hmac = crypto.createHmac('sha1', secretKey);
        hmac.update(policy);
        resolve(hmac.digest('base64'));
      } catch (e) {
        logger.error('Failed to sign policy with error', e);
        reject(e);
      }
    });
  }

  /**
   * Gets the json required by aws for a browser-side s3 upload. In the returns field,
   * x is a base64-encoded json policy, y is a hmac and sha of your private key, and z is our public key.
   *
   * @example
   *     GET /s3-upload-policy
   *     RETURNS { 'policy': x, 'signature': y, 'key': z }
   */
  _getS3UploadPolicy() {
    return function*() {
      var result = {};
      var creds = yield this._getKeyFromCredentials();

      result.key = creds.accessKeyId;
      result.policy = yield this._getPolicy();
      result.signature = yield this._getSignature(result.policy, creds.secretAccessKey);
    };
  }

  /**
   * Registers routes on the router.
   *
   * @param {Object} router the koa router object.
   */
  register(router) {
    router.post('/s3-upload-policy', this._getS3UploadPolicy());
  }
}
