var logger = require('../logger.js');
var fs = require('fs');
var path = require('path');
var uuid = require('node-uuid');

function getProjectPath(/* String */ username, /* UUID */ projectid) {
  return path.join(__dirname, "..", "yodel88", username, projectid);
}

function* createProject() {
  var project, callback, filePath;

  project = this.request.body;
  project.id = uuid.v4();
  project.username = this.params.username;

  filePath = getProjectPath(this.params.username, project.id);
  callback = function(err) {
    if (err) {
      logger.error("Got error " + err + " writing project " + JSON.stringify(project) + " to file " + filePath);
    } else {
      logger.info("successfully wrote project " + JSON.stringify(project) + " to file " + filePath);
    }
  };

  logger.info("writing project " + JSON.stringify(project) + " to file " + filePath);
  fs.writeFile(filePath, JSON.stringify(project), callback);
  this.body = project;
};

function* getProject() {
  var project, callback, filePath;

  filePath = getProjectPath(this.params.username, this.params.projectid);
  project = fs.readFileSync(filePath);

  logger.info("Successfully read project " + project + " from file " + filePath);
  this.body = project;
};

module.exports = {
  createProject: createProject,
  getProject: getProject
};