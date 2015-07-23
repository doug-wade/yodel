var app     = require('../../build/server.js');
var request = require('supertest').agent(app.listen());

describe('Portfolios', function() {
    function login(params, callback) {
        params = params || { username: 'noel', password: 'testtest' };
        request.post('/login').send(params).end(callback);
    }

    it('should get 401 unauthorized if user is not authenticated to retrieve portfolios', function(done) {
        request
            .get('/user/noel/portfolio')
            .expect(401, done);
    });

    it('should get no portfolios if user does not exist', function(done) {
        var loginParams = {
            username: 'noel',
            password: 'testtest'
        };
        request
            .post('/login')
             .send(loginParams)
             .end(function(err, res) {
                request
                    .get('/user/bob/portfolio')
                    .set('Authorization', 'Bearer ' + res.body.token)
                    .expect([])
                    .expect(200, done);
             });
    });

    it('should get all portfolios for the given user', function(done) {
        var loginParams = {
            username: 'noel',
            password: 'testtest'
        };
        request
            .post('/login')
             .send(loginParams)
             .end(function(err, res) {
                request
                    .get('/user/noel/portfolio')
                    .set('Authorization', 'Bearer ' + res.body.token)
                    .expect(function(res) {
                        if (res.body.length !== 2) return 'missing portfolios';
                    })
                    .expect(200, done);
             });
    });

    it('should get 401 unauthorized if user is not authenticated to retrieve portfolio items', function(done) {
        request
            .get('/user/noel/portfolio/heynow/nextToken/0')
            .expect(401, done);
    });

    it('should return empty list if no portfolio is found', function(done) {
        var loginParams = {
            username: 'noel',
            password: 'testtest'
        };
        request
            .post('/login')
             .send(loginParams)
             .end(function(err, res) {
                request
                    .get('/user/noel/portfolio/heynow/nextToken/0')
                    .set('Authorization', 'Bearer ' + res.body.token)
                    .expect({ items: [] })
                    .expect(200, done);
             });
    });

    it('should get the first set of items in the portfolio', function(done) {
        var loginParams = {
            username: 'noel',
            password: 'testtest'
        };
        request
            .post('/login')
             .send(loginParams)
             .end(function(err, res) {
                request
                    .get('/user/noel/portfolio/Chaplin Collection/nextToken/0')
                    .set('Authorization', 'Bearer ' + res.body.token)
                    .expect(function(res) {
                        if (res.body.length < 2) return 'missing portfolio items';
                        if (res.body.length > 2) return 'too many portfolio items';
                        if (res.body.nextToken !== 2) return 'new offset not set';
                    })
                    .expect(200, done);
             });
    });

    it('should get 401 unauthorized if user is not authenticated to upload a portfolio item', function(done) {
        request
            .post('/user/noel/portfolio/heynow/item')
            .expect(401, done);
    });

    it('should get 400 if user has no portfolios', function(done) {
        var loginParams = {
            username: 'noel',
            password: 'testtest'
        };
        request
            .post('/login')
             .send(loginParams)
             .end(function(err, res) {
                request
                    .post('/user/bob/portfolio/heynow/item')
                    .set('Authorization', 'Bearer ' + res.body.token)
                    .expect('user has no portfolio')
                    .expect(400, done);
             });
    });

    it('should return 400 if request is not multipart (file upload required)', function(done) {
        var loginParams = {
            username: 'ivan',
            password: 'testtest'
        };
        request
            .post('/login')
             .send(loginParams)
             .end(function(err, res) {
                var itemParams = {
                };
                request
                    .post('/user/ivan/portfolio/Sounds of Seattle/item')
                    .set('Authorization', 'Bearer ' + res.body.token)
                    .send(itemParams)
                    .expect(400, done);
             });
    });

// TODO write test for upload without caption
//    it('should return 400 if request does not include caption', function(done) {
//
//    });

// TODO write test for successful image upload
//    it('should successfully upload an item to portfolio', function(done) {
//
//    });

    it('should get 401 unauthorized if user is not authenticated to delete portfolio items', function(done) {
        request['delete']('/user/noel/portfolio/heynow/item/0')
            .expect(401, done);
    });

    it('should successfully delete a given item', function(done) {
        var loginParams = {
            username: 'ivan',
            password: 'testtest'
        };
        var jwtToken;
        request
            .post('/login')
             .send(loginParams)
             .end(function(err, res) {
                  jwtToken = res.body.token;
                  request['delete']('/user/ivan/portfolio/Sounds of Seattle/item/3')
                      .set('Authorization', 'Bearer ' + jwtToken)
                      .expect(200)
                      .end(function(err, res) {
                          request
                              .get('/user/ivan/portfolio/Sounds of Seattle/nextToken/0')
                              .set('Authorization', 'Bearer ' + jwtToken)
                              .expect({ items: [] })
                              .expect(200, done);
                      });
             });
    });

    // TODO write tests for creating portfolios
});
