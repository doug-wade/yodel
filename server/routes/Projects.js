var db     = require('../util/db.js');
var logger = require('../logger.js');
var uuid   = require('node-uuid');

/**
 * Creates a controller for handling projects.
 *
 * @class ProjectController
 * @classdesc A controller for handling projects.
 */
export class ProjectsController {
  /**
   * Creates a project.
   *
   * @todo projects likely shouldn't be rooted on the username in the url.
   * @example
   *     POST /user/
   */
  _createProject(){
    return function*() {
      var project, username;

      username = this.params.username;

      project = this.request.body;
      project.id = uuid.v4();

      logger.info('User ' + username + ' is creating project ' + JSON.stringify(project));

      db.addProject(username, project);
      this.body = project;
    };
  }


  /**
   * Gets a specific project for a user.
   *
   * @todo Projects shouldn't be rooted on a user in the url.
   * @example
   *     GET /user/bmo/projects/:projectid
   *     RESULT {
   *       name: "Find Finn's missing sock"
   *     }
   */
  _getProjectForUser() {
    return function*() {
      var project, projectId, username;
      username = this.params.username;
      projectId = this.params.projectId;

      project = db.getProject(username, projectId);

      this.body = project;
    };
  }

  /**
   * Lists all projects for a user.
   */
  _listProjects() {
     return function*() {
      var username;
      username = this.params.username;

      logger.info('Listing projects for user: ' + username);
      this.body = db.getProjectsForUser(username);
    };
  }

  /**
   * Delets a project.
   */
  _deleteProject() {
    return function*() {
      var username, projectId;
      username = this.params.username;
      projectId = this.params.projectId;

      this.body = db.getProject(username, projectId);
      db.deleteProject(username, projectId);
    };
  }

  /**
   * Registers routes on the router.
   *
   * @param {Object} router the koa router object.
   */
  register(router) {
    router.post('/user/:username/projects', this._createProject());
    router.get('/user/:username/projects/:projectid', this._getProjectForUser());
    router.get('/user/:username/projects', this._listProjects());
    router.del('/user/:username/projects/:projectid', this._deleteProject());
  }
}
