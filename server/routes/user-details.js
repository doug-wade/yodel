var db = require('../util/db.js');

function* getUser() {
  // TODO check authorization (access control)

  this.body = [];
  var userDetails = db.getUserDetails(this.params.username);

  if (userDetails) {
    this.body = userDetails;
  }
}

function* getAllUsers() {
  var users = db.getAllUsers();

  // Strip sensitive information (db index info, plain-text password :smh:, &c) before returning users.
  this.body = users.map((user) => { return { 'username': user.username, 'email': user.email }; });
}

module.exports = {
  getAllUsers: getAllUsers,
  getUser: getUser
};
