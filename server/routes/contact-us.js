var config = require('../config.js');
var db = require('../util/db.js');
var logger = require('../logger.js');

function* createContact() {
  var contactInfo = this.request.body;
  contactInfo.created = new Date();
  logger.info(contactInfo);
  db.createContact(contactInfo);
  this.body = config.jsonSuccess;
}

module.exports = {
  createContact: createContact
};
