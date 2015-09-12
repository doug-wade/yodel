var db = require('../util/db.js');
var logger = require('../logger.js');

function* search() {
  var query = this.params.query;
  var results = [];

  db.searchUsers(query).forEach((user) =>
    results.push({
      'type': 'user',
      'label': user.username,
      'matchedText': user.username,
      'matchedProperty': 'username' })
  );
  db.searchProjects(query).forEach((project) =>
    results.push({
      type: 'project',
      label: project.name,
      'matchedText': 'implement this',
      'matchedProperty': 'implement this'
    })
  );

  logger.info('Got results ', results, ' for query ', query);

  this.body = { results: results };
}

module.exports = {
  search: search
};
