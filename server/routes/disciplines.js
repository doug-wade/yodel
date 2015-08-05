var config = require('../config/config.js');
var db = require('../util/db.js');
var logger = require('../logger.js');

function* getUserDisciplines() {
  var disciplinesBody = db.getAllDisciplines();
  logger.info(disciplinesBody);
  this.body = disciplinesBody;
}

function* setUserDisciplines() {
  db.addDisciplinesForUser(this.params.username, this.body);
  this.body = config.jsonSuccess;
}

module.exports = {
  getUserDisciplines: getUserDisciplines,
  setUserDisciplines: setUserDisciplines
};
