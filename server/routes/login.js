var config = require('../config/config.js');
var db = require('../util/db.js');
var {scrypt, scryptParameters} = config.configureScrypt(require('scrypt'));

function isInvalidPassword(/* Object */ user, /* String */ password) {
  if (!user) {
    return false;
  }

  return scrypt.verify(password, scryptParameters);
}

function constructProfile(/* Object */ user) {
  return {
    username: user.username,
    email: user.email
  };
}

function login(jwt) {
  return function* () {
    // basic login validation
    this.checkBody('username').notEmpty();
    this.checkBody('password').notEmpty();
    if (this.errors) {
      this.status = 400;
      this.body = this.errors;
      return;
    }

    var loginAttempt = this.request.body;
    var user = db.getUser(loginAttempt.username);
    if (isInvalidPassword(user, loginAttempt.password)) {
      this.status = 401;
      this.body = 'Unauthorized';
      return;
    }

    this.body = {
      username: user.username,
      token: jwt.sign(constructProfile(user), config.jwtAuthSecret, { expiresInMinutes: config.jwtTtl })
    };
  };
}

module.exports = {
  login: login
};
