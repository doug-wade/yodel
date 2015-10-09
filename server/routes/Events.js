var config = require('../config.js');
var db = require('../util/db.js');
var logger = require('../logger.js');

/**
 * Creates a controller for handling events.
 *
 * @class EventController
 * @classdesc A controller for handling events.
 */
export class EventsController {
  /**
   * Creates a new event.
   *
   * @example
   *     POST /events
   *     BODY [{
   *       "eventId": "58760e81-bc24-4470-9e13-9996c71ac8aa",
   *       "startDate": 1440460800000,
   *       "endDate": 1442793600000,
   *       "img": "/images/MaRainey.jpg",
   *       "location": {
   *         "lon": -122,
   *         "name": "Cornish Playhouse at Seattle Center",
   *         "lat": 47
   *       },
   *       "name": "Ma Rainey's Black Bottom",
   *       "created": 1443518750143,
   *       "description": "The third play in the Pittsburgh Cycle"
   *     }]
   *     RETURNS { 'message': 'sucess', 'status': 200 }
   */
   _addEvent() {
    return function*() {
      var newEvent = this.request.body;
      logger.info('Adding event ', newEvent);
      db.addEvent(newEvent).then(function(data, err) {
        if (err) {
          this.body = err;
        } else {
          this.body = config.jsonSuccess;
        }
      });
    };
  }

  /**
   * Get all events from the database.
   *
   * @example
   *     GET /events
   *     RETURN [{
   *       "eventId": "58760e81-bc24-4470-9e13-9996c71ac8aa",
   *       "startDate": 1440460800000,
   *       "endDate": 1442793600000,
   *       "img": "/images/MaRainey.jpg",
   *       "location": {
   *         "lon": -122,
   *         "name": "Cornish Playhouse at Seattle Center",
   *         "lat": 47
   *       },
   *       "name": "Ma Rainey's Black Bottom",
   *       "created": 1443518750143,
   *       "description": "The third play in the Pittsburgh Cycle"
   *     }]
   */
  _getEvents() {
    return function*() {
      this.body = yield db.getEvents();
    };
  }

  /**
   * Registers routes on the router.
   *
   * @param {Object} router the koa router object.
   */
  register(router) {
    router.get('/events', this._getEvents());
    router.post('/events', this._addEvent());
  }
}
