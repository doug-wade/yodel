var config = require('../config.js');
var db = require('../util/db.js');
var logger = require('../logger.js');

function* addDisciplines() {
  var disciplines = this.request.body;
  logger.info('Adding disciplines: ', disciplines);
  db.addDisciplines(disciplines.disciplines);
  this.body = config.jsonSuccess;
}

function* getUserDisciplines() {
  var disciplinesBody = db.getAllDisciplines();
  this.body = disciplinesBody;
}

function* setUserDisciplines() {
  var userDisciplines = this.request.body.disciplines;
  logger.info('Adding disciplines for user ' + this.params.username + ': ', userDisciplines);
  db.addDisciplinesForUser(this.params.username, userDisciplines);
  this.body = config.jsonSuccess;
}

module.exports = {
  addDisciplines: addDisciplines,
  getUserDisciplines: getUserDisciplines,
  setUserDisciplines: setUserDisciplines
};
