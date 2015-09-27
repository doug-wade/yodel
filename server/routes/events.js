var config = require('../config.js');
var db = require('../util/db.js');
var logger = require('../logger.js');

function* addEvent() {
  var newEvent = this.request.body;
  logger.info('Adding event ', newEvent);
  db.addEvent(newEvent).then(function(data, err) {
    if (err) {
      this.body = err;
    } else {
      this.body = config.jsonSuccess;
    }
  });

}

function* getEvents() {
  this.body = yield db.getEvents();
}

module.exports = {
  addEvent: addEvent,
  getEvents: getEvents
};
