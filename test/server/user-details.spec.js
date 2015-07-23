var app     = require('../../build/server.js');
var request = require('supertest').agent(app.listen());

describe('Users', function() {
    function login(params, callback) {
        params = params || { username: 'noel', password: 'testtest' };
        request.post('/login').send(params).end(callback);
    }

    it('should get 401 unauthorized if user is not authenticated', function(done) {
        request
            .get('/user')
            .expect(401);

        request
            .get('/user/noel')
            .expect(401, done);
    });

    it('should get no details if user doesn\'t exist', function(done) {
        var loginParams = {
            username: 'noel',
            password: 'testtest'
        };
        request
            .post('/login')
             .send(loginParams)
             .end(function(err, res) {
                request
                    .get('/user/john')
                    .set('Authorization', 'Bearer ' + res.body.token)
                    .expect([])
                    .expect(200, done);
             });
    });

    it('should get user details if user exists', function(done) {
        var loginParams = {
            username: 'noel',
            password: 'testtest'
        };
        request
            .post('/login')
            .send(loginParams)
            .end(function(err, res) {
                request
                    .get('/user/noel')
                    .set('Authorization', 'Bearer ' + res.body.token)
                    .expect(function(res) {
                        if (res.body.fullName !== 'Noel Sardana') return 'bad full name';
                        if (res.body.artistType !== 'Hipster Coder') return 'bad artist type';
                    })
                    .expect(200,done)
            });
    });
});
