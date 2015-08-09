var db     = require('../util/db.js');
var logger = require('../logger.js');
var uuid   = require('node-uuid');

function* createProject() {
  var project, username;

  username = this.params.username;

  project = this.request.body;
  project.username = this.params.username;
  project.id = uuid.v4();

  logger.info('User ' + username + ' is creating project ' + JSON.stringify(project));

  db.addProject(project);
  this.body = project;
}

function* getProjectForUser() {
  var project, projectId, username;
  username = this.params.username;
  projectId = this.params.projectId;

  project = db.getProject(username, projectId);

  this.body = project;
}

function* listProjects() {
  var username;
  username = this.params.username;

  logger.info('Listing projects for user: ' + username);
  this.body = db.getProjectsForUser(username);
}

function* deleteProject() {
  var username, projectId;
  username = this.params.username;
  projectId = this.params.projectId;

  this.body = db.getProject(username, projectId);
  db.deleteProject(username, projectId);
}

module.exports = {
  createProject: createProject,
  getProject: getProjectForUser,
  listProjects: listProjects,
  deleteProject: deleteProject
};