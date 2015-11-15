var config = require('../config.js');
var db = require('../util/db.js');
var logger = require('../logger.js');
var bcrypt = require('bcrypt');
var q = require('q');

/**
 * Creates a controller for handling login.
 *
 * @class LoginController
 * @classdesc A controller for handling login
 */
export class LoginController {
  /**
   * Validates whether the password provided is the same password as the password provided when the account was created.
   *
   * @todo Don't take the user as a parameter, only take the password so I can rename password to password hash or something.
   * @param {Object} user The user to validate the password for.
   * @param {string} password The password to hash and compare.
   * @returns {Boolean} True if the password is invalid, false otherwise.
   */
  _isInvalidPassword(user, password) {
    var deferred = q.defer();

    logger.info('validating password...');
    if (!user) {
      return deferred.resolve(false);
    }

    logger.info('comparing password ' + password + ' to hash ' + user.password);
    bcrypt.compare(password, user.password, function (err, res) {
      if (err) {
        deferred.reject(err);
      }
      deferred.resolve(res);
    });

    return deferred.promise;
  }

  /**
   * Constucts a profile for signing jwt tokens from a user object.
   * @param {Object} user The user to create the jwt profile for.
   * @return {Object} The jwt profile
   */
  _constructProfile(user) {
    return {
      username: user.username,
      email: user.email
    };
  }

  /**
   * Attempts to log in a user.
   *
   * @param jwt the jwt token generator.
   * @example
   *     POST /login
   *     BODY {
   *       'username': ''
   *     }
   */
  _login(jwt) {
    var _this = this;
    return function*() {
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
      user = yield db.getUser(loginAttempt.username);
      logger.info('checking password for user', user);
      var isValidPassword = yield _this._isInvalidPassword(user, loginAttempt.password);
      if (!isValidPassword) {
        this.status = 401;
        this.body = 'Unauthorized';
        return;
      }

      try {
        token = jwt.sign(_this._constructProfile(user), config.jwtAuthSecret, { expiresInMinutes: config.jwtTtl });
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

  /**
   * Registers routes on the router.
   *
   * @param {Object} router the koa router object.
   */
  register(router, jwt) {
    router.post('/login', this._login(jwt));
  }
}
