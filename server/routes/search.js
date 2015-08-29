var db = require('../util/db.js');
var logger = require('../logger.js');

function* search() {
  var query = this.params.query;
  var results = {};

  results.users = db.searchUsers(query);
  results.projects = db.searchProjects(query);

  logger.info('Got results ', results, ' for query ', query);

  this.body = results;
}

module.exports = {
  search: search
};
