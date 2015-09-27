var encoding = 'utf8';
var config = {
    aws: {
        yodelS3Bucket: 'yodel88',
        ddbEndpoint: 'dynamodb.us-west-2.amazonaws.com',
        region: 'us-west-2'
    },

    // On a 2 GHz processor, expect ~5 hashes a second
    bcryptRounds: 11,

    encoding: encoding,

    jsonSuccess: { 'status': 200, 'message': 'success' },

    // TODO load this from a file using a "refresher" strategy; see https://github.com/auth0/node-jsonwebtoken
    jwtAuthSecret: 'yodel-super-secret',

    jwtTtl: 1440,

    isProd: true,

    name: 'prod'
};

module.exports = config;
