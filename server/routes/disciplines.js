var config = require('../config/config.js');
var db = require('../util/db.js');

function* getUserDisciplines() {
  this.body = db.getAllDisciplines();
}

function* setUserDisciplines() {
  // TODO Store these disciplines in association with a particular username here
  db.updateDisciplinesForUser(this.params.username, this.body);
  this.body = config.jsonSuccess;
}

module.exports = {
  getUserDisciplines: getUserDisciplines,
  setUserDisciplines: setUserDisciplines
};
