var db     = require('../util/db.js');
var fs     = require('fs');
var logger = require('../logger.js');
var path   = require('path');
var uuid   = require('node-uuid');

function* createProject(username) {
  var project, username;
  this.username = this.params.username;

  project = this.request.body;
  project.id = uuid.v4();

  db.addProject(username, project);
  this.body = project;
};

function* getProjectForUser(username, projectid) {
  var project, projectid, username;
  username = this.params.username;
  projectid = this.params.projectid;

  project = db.getProject(username, projectid);

  this.body = project;
};

function* listProjects() {
  var username;
  username = this.params.username;

  logger.info("Listing projects for user: " + username);
  this.body = db.getProjectsForUser(username);
};

function* deleteProject(username, projectid) {
  var username, projectid;
  username = this.params.username;
  projectid = this.params.projectid;

  this.body = db.getProject(username, projectid);
  db.deleteProject(username, projectid);
}

module.exports = {
  createProject: createProject,
  getProject: getProjectForUser,
  listProjects: listProjects,
  deleteProject: deleteProject
};