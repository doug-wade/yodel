var db = require('../util/db.js');

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
      var userDetails = db.getUser(this.params.username);

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
      var users = db.getAllUsers();

      // Strip sensitive information (db index info, plain-text password :smh:, &c) before returning users.
      this.body = users.forEach((user) => { return { 'username': user.username, 'email': user.email }; });
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
