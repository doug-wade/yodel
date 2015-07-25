var config = require('../config/config.js');
var db = require('../util/db.js');

function isInvalidPassword(/* Object */ user, /* String */ password) {
  return user === undefined || user.password !== password;
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

    var login = this.request.body;
    var user = db.getUser(login.username);
    if (isInvalidPassword(user, login.password)) {
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