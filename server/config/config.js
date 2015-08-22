var encoding = 'utf8';
var config = {
    aws: {
        yodelS3Bucket: 'yodel88',
        region: 'us-west-2',
        accessKey: 'path/to/file',
        secretKey: 'path/to/file'
    },

    encoding: encoding,

    jsonSuccess: { 'status': 200, 'message': 'success' },

    // TODO load this from a file using a "refresher" strategy; see https://github.com/auth0/node-jsonwebtoken
    jwtAuthSecret: 'yodel-super-secret',

    jwtTtl: 1440,

    configureScrypt: function (scrypt) {
      // Scrypt config
      var scryptParameters = scrypt.params(0.1);
      scrypt.hash.config.outputEncoding = encoding;
      scrypt.hash.config.keyEncoding = encoding;
      scrypt.verify.config.keyEncoding = encoding;

      return {scrypt: scrypt, scryptParameters: scryptParameters};
    }
};

// TODO load these from the files provided in the config
process.env['AWS_ACCESS_KEY_ID '] = 'AKIAIV6QQEMQNQSZVERA';
process.env['AWS_SECRET_ACCESS_KEY '] = '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';

module.exports = config;
