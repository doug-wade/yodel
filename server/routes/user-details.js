var db = require('../util/db.js');

function* getUser() {
  // TODO check authorization (access control)

  this.body = [];
  var userDetails = db.getUserDetails(this.params.username);

  if (userDetails) {
    this.body = userDetails;
  }
};

module.exports = {
  getUser: getUser
};