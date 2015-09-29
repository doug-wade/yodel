var bcrypt = require('bcrypt');
var config = require('../config.js');
var db     = require('../util/db.js');
var logger = require('../logger.js');
var q      = require('q');

function isUsernameTaken(/* String */ username) {
  return db.getUser(username) !== undefined;
}

function constructProfile(/* Object */ user) {
  return {
    username: user.username,
    email: user.email
  };
}

function generateHashAndSalt(password) {
  var deferred = q.defer();
  bcrypt.genSalt(config.bcryptRounds, function (saltErr, salt) {
    if (saltErr) {
      deferred.reject(saltErr);
    }
    bcrypt.hash(password, salt, function(hashErr, hash) {
      if (hashErr) {
        deferred.reject(hashErr);
      }
      deferred.resolve(hash);
    });
  });
  return deferred.promise;
}

function signup(jwt) {
  return function* () {
    // basic signup validation
    var contact, signupBody, hash;

    signupBody = this.request.body;
    this.checkBody('username').notEmpty();
    this.checkBody('email').isEmail();
    this.checkBody('password1').notEmpty().len(6);
    this.checkBody('password2').notEmpty().eq(signupBody.password1, 'Passwords must match');
    this.checkBody('betaToken').notEmpty().len(16);

    if (isUsernameTaken(signupBody.username)) {
      if (!this.errors) {
        this.errors = [];
      }

      this.errors.push({ username: 'Username is taken' });
    }

    if (this.errors) {
      logger.warn(this.errors);
      this.status = 400;
      this.body = this.errors;
      return;
    }

    hash = yield generateHashAndSalt(signupBody.password1);
    contact = yield db.getContact(signupBody.email);

    if (!contact || signupBody.betaToken !== contact.betaToken) {
      logger.info('User with email ' + signupBody.email + ' attempted to sign up with invalid beta token.');
      this.status = 400;
      this.body = 'Invalid Beta Token';
      return;
    }

    db.addUser({
      username: signupBody.username,
      email: signupBody.email,
      password: hash
    });

    this.body = {
      username: signupBody.username,
      token: jwt.sign(constructProfile(signupBody), config.jwtAuthSecret, { expiresInMinutes: config.jwtTtl })
    };
  };
}

module.exports = {
  signup: signup
};
