var encoding = 'utf8';
var config = {
    aws: {
        yodelS3Bucket: 'yodel88',
        region: 'us-west-2',
        accessKey: 'path/to/file',
        secretKey: 'path/to/file'
    },

    // On a 2 GHz processor, expect ~5 hashes a second
    bcryptRounds: 11,

    encoding: encoding,

    jsonSuccess: { 'status': 200, 'message': 'success' },

    // TODO load this from a file using a "refresher" strategy; see https://github.com/auth0/node-jsonwebtoken
    jwtAuthSecret: 'yodel-super-secret',

    jwtTtl: 1440
};

// TODO load these from the files provided in the config
process.env['AWS_ACCESS_KEY_ID '] = 'AKIAIV6QQEMQNQSZVERA';
process.env['AWS_SECRET_ACCESS_KEY '] = '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';

module.exports = config;
