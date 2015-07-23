var app, request;

var app     = require('../../build/server.js');
var request = require('supertest').agent(app.listen());


describe('Login', function() {
    it('should respond with 400 if username is empty', function(done) {
        var loginParams = {
            password: 'good#password'
        };
        request
            .post('/login')
            .send(loginParams)
            .expect(function(res) {
                if (res.body.filter(function(ele) { return !!ele['username']; }).length === 0) {
                    return 'missing username validation';
                }
            })
            .expect(400, done);
    });

    it('should respond with 400 if password is empty', function(done) {
        var loginParams = {
            username: 'Bob Testypants'
        };
        request
            .post('/login')
            .send(loginParams)
            .expect(function(res) {
                if (res.body.filter(function(ele) { return !!ele['password']; }).length === 0) {
                    return 'missing password validation';
                }
            })
            .expect(400, done);
    });

    it('should respond with 401 if user doesn\'t exist', function(done) {
        var loginParams = {
            username: 'Bob Testypants',
            password: 'good#password'
        };
        request
            .post('/login')
            .send(loginParams)
            .expect(401, done);
    });

    it('should respond with 401 if password doesn\'t match username', function(done) {
        // TODO mock db dependency and inject data
        var loginParams = {
            username: 'noel',
            password: 'good#password'
        };
        request
            .post('/login')
            .send(loginParams)
            .expect(401, done);
    });

    it('should authenticate a user with jwt token if correct password is supplied', function(done) {
        var loginParams = {
            username: 'noel',
            password: 'testtest'
        };
        var response = request
            .post('/login')
            .send(loginParams)
            .expect(200)
            .expect(function(response) {
                var jwt = response.body;
                if (jwt.username !== 'noel') return 'jwt missing username';
                if (!jwt.token) return 'jwt missing token';
            })
            .end(done);
    });
});
