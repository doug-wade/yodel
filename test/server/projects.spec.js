var app     = require('../../build/server.js');
var request = require('supertest').agent(app.listen());

describe('Projects', function() {
    function login(params, callback) {
        params = params || { username: 'noel', password: 'testtest' };
        request.post('/login').send(params).end(callback);
    }

    // TODO write project tests
});
