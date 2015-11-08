var bcrypt = require('bcrypt');
var config = require('../config.js');
var db     = require('../util/db.js');
var logger = require('../logger.js');
var q      = require('q');
var ses    = require('../util/ses');

/**
 * Creates a controller for handling signup.
 *
 * @class SignupController
 * @classdesc A controller for handling signup
 */
export class SignupController {
  /**
   * Converts a user object into the profile used to sign the jwt token.
   *
   * @param {object} The user to convert.
   * @returns {object} A profile for a jwt token.
   */
  _constructProfile(/* Object */ user) {
    return {
      username: user.username,
      email: user.email
    };
  }

  /**
   * Generates a salted password hash from a plain-text password.  This hash is used in password verification -- it is
   * persisted on creation, and generated again when the user attempts to log-in and compared.
   *
   * @todo Upgrade to scrypt doug 2015.10.3 I tried node-scrypt and couldn't get it to work. We should try again and file a bug
   * @param {string} The plain-text password to be hashed.
   * @returns A promise for a salted password hash.
   */
  _generateHashAndSalt(password) {
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

  /**
   * Creates a new user.
   *
   * @returns {function} A function that returns the generator function to be used by koa.
   * @param {Object} the jwt token generator.
   * @example
   *     POST /signup
   *     BODY {
   *       betaToken: "qxAeSbWtfzByCbOe1FtsIg=="
   *       email: "pb@yodel.to"
   *       password1: "testtest"
   *       password2: "testtest"
   *       username: "Princess Bubblegum"
   *     }
   *     RESULT {}
   */
  _signup(jwt) {
    var _this = this;
    return function* signup() {
      // basic signup validation
      var contact, signupBody, hash;

      signupBody = this.request.body;
      this.checkBody('username').notEmpty();
      this.checkBody('email').isEmail();
      this.checkBody('password1').notEmpty().len(6);
      this.checkBody('password2').notEmpty().eq(signupBody.password1, 'Passwords must match');
      this.checkBody('betaToken').notEmpty().len(16);

      let existingUser = yield db.getUser(signupBody.username);
      logger.info('checcking to see if username is taken; got user from db', existingUser);

      if (existingUser) {
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

      hash = yield _this._generateHashAndSalt(signupBody.password1);
      if (config.isProd || (signupBody.betaToken !== config.universalBetaToken)) {
        contact = yield db.getContact(signupBody.email);

        if (!contact || signupBody.betaToken !== contact.betaToken) {
          logger.info('User with email ' + signupBody.email + ' attempted to sign up with invalid beta token.');
          this.status = 400;
          this.body = 'Invalid Beta Token';
          return;
        }
      }

      db.addUser({
        username: signupBody.username,
        email: signupBody.email,
        password: hash
      }).then(function(res, err) {
        if (err) {
          logger.error(err);
        } else {
          var templateInformation = {
            username: signupBody.username,
            email: signupBody.email,
            subject: 'Welcome to Yodel!'
          };
          ses.sendHtmlEmailFromTemplate(signupBody.email, templateInformation.subject, 'signup.templ.html', templateInformation);
        }
      });

      this.body = {
        username: signupBody.username,
        token: jwt.sign(_this._constructProfile(signupBody), config.jwtAuthSecret, { expiresInMinutes: config.jwtTtl })
      };
    };
  }

  /**
   * Registers routes on the router.
   *
   * @param {Object} router the koa router object.
   */
  register(router, jwt) {
    router.post('/signup', this._signup(jwt));
  }
}
