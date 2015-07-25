var testData = require('../config/test-data.js');

function* getUserDisciplines() {
  this.body = testData.disciplines;
};

function* setUserDisciplines() {
  // TODO Store these disciplines in association with a particular username here
  testData.users[this.params.username]['disciplines'] = this.body;
  this.body = "'Success'";
};

module.exports = {
  getUserDisciplines: getUserDisciplines,
  setUserDisciplines: setUserDisciplines
};

