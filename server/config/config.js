var config = {
    aws: {
        yodelS3Bucket: 'yodel88',
        region: 'us-west-2',
        accessKey: 'path/to/file',
        secretKey: 'path/to/file'
    },

    // TODO load this from a file using a "refresher" strategy; see https://github.com/auth0/node-jsonwebtoken
    jwtAuthSecret: 'yodel-super-secret'
};

// TODO load these from the files provided in the config
process.env['AWS_ACCESS_KEY_ID '] = 'AKIAIV6QQEMQNQSZVERA';
process.env['AWS_SECRET_ACCESS_KEY '] = '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';

module.exports = config;