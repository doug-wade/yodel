var encoding = 'utf8';
var config = {
    aws: {
        yodelS3Bucket: 'yodel88',
        ddbEndpoint: 'dynamodb.us-west-2.amazonaws.com',
        sesEndpoint: 'email.us-west-2.amazonaws.com',
        sesArn: 'arn:aws:ses:us-west-2:202860285120:identity/yodel.is',
        region: 'us-west-2'
    },

    // On a 2 GHz processor, expect ~5 hashes a second
    bcryptRounds: 11,

    encoding: encoding,

    jsonSuccess: { 'status': 200, 'message': 'success' },

    jwtAuthSecret: 'yodel-super-secret',

    jwtTtl: 1440,

    isProd: false,

    name: 'dev',

    noreply: 'robot-doug@yodel.is',

    universalBetaToken: 'PleaseDontGiveThisToRealUsers',

    schema: {
      contact: {
        tablename: 'TestContact'
      },
      discipline: {
        tablename: 'TestDiscipline'
      },
      event: {
        tablename: 'TestEvent'
      },
      portfolio: {
        tablename: 'TestPortfolio'
      },
      project: {
        tablename: 'TestProject'
      },
      user: {
        tablename: 'TestUser'
      }
    }
};

module.exports = config;
