var config = require('../config.js');
var db = require('../util/db.js');
var logger = require('../logger.js');
var bcrypt = require('bcrypt');
var q = require('q');

function isInvalidPassword(/* Object */ user, /* String */ password) {
  var deferred = q.defer();

  logger.info('validating password...');
  if (!user) {
    return deferred.resolve(false);
  }

  bcrypt.compare(password, user.password, function (err, res) {
    if (err) {
      deferred.reject(err);
    }
    deferred.resolve(res);
  });

  return deferred.promise;
}

function constructProfile(/* Object */ user) {
  return {
    username: user.username,
    email: user.email
  };
}

function login(jwt) {
  return function* () {
    var loginAttempt, token, user;
    // basic login validation
    this.checkBody('username').notEmpty();
    this.checkBody('password').notEmpty();
    if (this.errors) {
      this.status = 400;
      this.body = this.errors;
      return;
    }

    loginAttempt = this.request.body;
    user = db.getUser(loginAttempt.username);
    logger.info('checking password for user', user);
    var isValidPassword = yield isInvalidPassword(user, loginAttempt.password);
    if (!isValidPassword) {
      this.status = 401;
      this.body = 'Unauthorized';
      return;
    }

    try {
      token = jwt.sign(constructProfile(user), config.jwtAuthSecret, { expiresInMinutes: config.jwtTtl });
    } catch (e) {
      logger.error(e);
    }

    var body = {
      username: user.username,
      token: token
    };

    logger.info(body);

    this.body = body;
  };
}

module.exports = {
  login: login
};
