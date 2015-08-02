var config = require('../config/config.js');
var db = require('../util/db.js');

function isUsernameTaken(/* String */ username) {
  return db.getUser(username) !== undefined;
}

function constructProfile(/* Object */ user) {
  return {
    username: user.username,
    email: user.email
  };
}

function signup(jwt) {
  return function* () {
    // basic signup validation
    var signup = this.request.body;
    this.checkBody('username').notEmpty();
    this.checkBody('email').isEmail();
    this.checkBody('password1').notEmpty().len(6);
    this.checkBody('password2').notEmpty().eq(signup.password1, 'Passwords must match');

    if (isUsernameTaken(signup.username)) {
      if (!this.errors) {
        this.errors = [];
      }

      this.errors.push({ username: 'Username is taken' });
    }

    if (this.errors) {
      this.status = 400;
      this.body = this.errors;
      return;
    }

    db.addUser({
      username: signup.username,
      email: signup.email,
      password: signup.password1
    });

    this.body = {
      username: signup.username,
      token: jwt.sign(constructProfile(signup), config.jwtAuthSecret, { expiresInMinutes: config.jwtTtl })
    };
  };
}

module.exports = {
  signup: signup
};
