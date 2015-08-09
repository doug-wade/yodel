var config = require('../config/config.js');
var db = require('../util/db.js');
var logger = require('../logger.js');

function* getUserDisciplines() {
  var disciplinesBody = db.getAllDisciplines();
  logger.info(disciplinesBody);
  this.body = disciplinesBody;
}

function* setUserDisciplines() {
	logger.info('username: ' + this.params.username);
	logger.info('request: ' + JSON.stringify(this.request.body));
  db.addDisciplinesForUser(this.params.username, this.request.body);
  this.body = config.jsonSuccess;
}

module.exports = {
  getUserDisciplines: getUserDisciplines,
  setUserDisciplines: setUserDisciplines
};
