var app     = require('../../build/server.js');
var request = require('supertest').agent(app.listen());

describe('Disciplines', function() {
    function login(params, callback) {
        params = params || { username: 'noel', password: 'testtest' };
        request.post('/login').send(params).end(callback);
    }

    it('should get 401 unauthorized if user is not authenticated to retrieve disciplines', function(done) {
        request
            .get('/user/noel/disciplines')
            .expect(401, done);
    });

    it('should get disciplines for user', function(done) {
        // TODO why does the discipline retrieval depend on the username?
        // TODO this test is currently meaningless
        var loginParams = {
            username: 'noel',
            password: 'testtest'
        };
        request
            .post('/login')
             .send(loginParams)
             .end(function(err, res) {
                request
                    .get('/user/fake/disciplines')
                    .set('Authorization', 'Bearer ' + res.body.token)
                    .expect(function(res) {
                        console.log(res.body.length);
                        if (res.body.length !== 12) return 'missing disciplines';
                    })
                    .expect(200, done);
             });
    });

    // TODO write discipline update tests
});
