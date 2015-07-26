var app, request;

app     = require('../../build/server.js');
request = require('supertest').agent(app.listen());

describe('GET /', function() {
    it('should respond with a view', function(done) {
        // TODO make this test better
        request.get("/").expect(200, done);
    });
});