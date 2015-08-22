var config = require('../config/config.js');
var db = require('../util/db.js');
var logger = require('../logger.js');
var {scrypt, scryptParameters} = config.configureScrypt(require('scrypt'));

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
    var signupBody, hash;

    signupBody = this.request.body;
    logger.info(signupBody);
    this.checkBody('username').notEmpty();
    this.checkBody('email').isEmail();
    this.checkBody('password1').notEmpty().len(6);
    this.checkBody('password2').notEmpty().eq(signupBody.password1, 'Passwords must match');

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

    hash = scrypt.hash(new Buffer(signupBody.password1), scryptParameters);

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
