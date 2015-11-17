var db = require('../util/db.js');
var logger = require('../logger.js');

/**
 * Creates a controller for handling users.
 *
 * @class UserDetailsController
 * @classdesc A controller for handling users
 */
export class UserDetailsController {
  /**
   * Get a user.
   *
   * @todo doug 10/3/2015 Noel left this todo: check authorization (access control).  I think it's been solved?
   */
  _getUser() {
    return function*() {

      this.body = [];
      var userDetails = yield db.getUser(this.params.username);

      if (userDetails) {
        this.body = userDetails;
      }
    };
  }

  /**
   * Get all users.
   */
  _getAllUsers() {
    return function* () {
      var users = yield db.getAllUsers();

      // Strip sensitive information (db index info, password hash, &c) before returning users.
      this.body = users.map((user) => {
        logger.info(user);
        return { 'username': user.username, 'email': user.email };
      });
    };
  }

  /**
   * Registers routes on the router.
   *
   * @param {Object} router the koa router object.
   */
  register(router) {
    router.get('/user', this._getAllUsers());
    router.get('/user/:username', this._getUser());
  }
}
