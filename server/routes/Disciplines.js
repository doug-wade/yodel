var config = require('../config.js');
var db = require('../util/db.js');
var logger = require('../logger.js');

/**
 * Creates a controller for handling disciplines.
 *
 * @class DisciplineController
 * @classdesc A controller for handling disciplines.
 */
 export class DisciplineController {
  /**
   * Add disciplines to the database.
   *
   * @example
   *     POST /discipline
   *     BODY {
   *     }
   *     RETURNS { 'message': 'Success', 'status': 200 }
   */
   _addDisciplines (){
      return function* () {
        var disciplines = this.request.body;
        logger.info('Adding disciplines: ', disciplines);
        db.addDisciplines(disciplines.disciplines);
        this.body = config.jsonSuccess;
      };
    }

  /**
   * Get user disciplines from the database.
   *
   * @example
   *     GET /discipline
   *     RETURNS [
   *     ]
   */
  _getDisciplines() {
    return function* () {
      let disciplinesBody = yield db.getAllDisciplines();
      logger.info('Got ' + disciplinesBody.length + ' disciplines in GET /discipline');
      this.body = disciplinesBody;
    };
  }

  /**
  * Sets the disciplines for a given user.
  *
  * @example
  *     POST /user/jake/disciplines
  *     BODY [{
  *     }]
  *     RETURNS { 'message': 'Success', 'status': 200 }
  */
  _setUserDisciplines() {
    return function*() {
      var userDisciplines = this.request.body.disciplines;
      logger.info('Adding disciplines for user ' + this.params.username + ': ', userDisciplines);
      db.addDisciplinesForUser(this.params.username, userDisciplines);
      this.body = config.jsonSuccess;
    };
  }

  /**
   * Registers routes on the router.
   *
   * @param {Object} router the koa router object.
   */
  register(router) {
    router.post('/discipline', this._addDisciplines());
    router.post('/user/:username/disciplines', this._setUserDisciplines());
    router.get('/discipline', this._getDisciplines());
  }
}
