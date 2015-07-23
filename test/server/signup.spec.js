var app, request;

var app     = require('../../build/server.js');
var request = require('supertest').agent(app.listen());


describe('Signup', function() {
    it('should respond with 400 if username is empty', function(done) {
        var signupParams = {};
        request
            .post('/signup')
            .send(signupParams)
            .expect(function(res) {
                if (res.body.filter(function(ele) { return !!ele['username']; }).length === 0) {
                    return 'missing username validation';
                }
            })
            .expect(400, done);
    });

    it('should respond with 400 if email is empty', function(done) {
        var signupParams = {
            username: 'Bob Testypants'
        };
        request
            .post('/signup')
            .send(signupParams)
            .expect(function(res) {
                if (res.body.filter(function(ele) { return !!ele['email']; }).length === 0) {
                    return 'missing email validation';
                }
            })
            .expect(400, done);
    });

    it('should respond with 400 if password2 is empty', function(done) {
        var signupParams = {
            username: 'Bob Testypants',
            email: 'bob@testypants.com'
        };
        request
            .post('/signup')
            .send(signupParams)
            .expect(function(res) {
                if (res.body.filter(function(ele) { return !!ele['password1']; }).length === 0) {
                    return 'missing password1 validation';
                }
            })
            .expect(400, done);
    });

    it('should respond with 400 if password2 is empty', function(done) {
        var signupParams = {
            username: 'Bob Testypants',
            email: 'bob@testypants.com',
            password1: 'good#password'
        };
        request
            .post('/signup')
            .send(signupParams)
            .expect(function(res) {
                if (res.body.filter(function(ele) { return !!ele['password2']; }).length === 0) {
                    return 'missing password2 validation';
                }
            })
            .expect(400, done);
    });

    it('should respond with 400 if password2 does not match password1', function(done) {
        var signupParams = {
            username: 'Bob Testypants',
            email: 'bob@testypants.com',
            password1: 'good#password',
            password2: 'good#pass'
        };
        request
            .post('/signup')
            .send(signupParams)
            .expect(function(res) {
                if (res.body.filter(function(ele) { return !!ele['password2']; }).length === 0) {
                    return 'missing password2 validation';
                }
            })
            .expect(400, done);
    });

    it('should respond with 400 if username is already taken', function(done) {
        var signupParams = {
            username: 'noel',
            email: 'bob@testypants.com',
            password1: 'good#password',
            password2: 'good#password'
        };
        request
            .post('/signup')
            .send(signupParams)
            .expect(function(res) {
                if (res.body.filter(function(ele) { return !!ele['username']; }).length === 0) {
                    return 'missing username validation';
                }
            })
            .expect(400, done);
    });

    it('should respond create a new user', function(done) {
        var signupParams = {
            username: 'bob',
            email: 'bob@testypants.com',
            password1: 'good#password',
            password2: 'good#password'
        };
        request
            .post('/signup')
            .send(signupParams)
            .expect(200, done);
    });
});
