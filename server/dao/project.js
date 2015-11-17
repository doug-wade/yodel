var logger = require('../logger.js');
var uuid   = require('node-uuid');
var schema = require('../config').schema;
var q = require('q');
var {existsAndIncludes} = require('../util/predicates');

module.exports = function(db) {
  return {
    addProject: function(userId, project) {
      logger.info('Inserting project into db', project);
      project.projectId = uuid.v4();
      project.created = new Date().getTime();
      project.userId = userId;

      var params = {
        TableName: schema.project.tablename,
        Item: project
      };

      var deferred = q.defer();
      db.put(params, function(err, data) {
         if (err) {
           logger.error('Failed to add project ', project.name, ' with error ', err);
           deferred.reject(err);
         } else {
           logger.info('Created new project: ' + project.name);
           deferred.resolve(data);
         }
      });
      return deferred.promise;
    },

    getProject: function(username, projectId) {
      var deferred = q.defer();
      var params = {
        TableName: schema.project.tablename,
        Key: {
            'projectId': projectId,
            'username': username
        }
      };

      db.get(params, function(err, data) {
        if (err) {
            logger.error('Unable to get project ' + projectId + ' for user ' + username + ' with error ', err);
            deferred.reject(new Error(err));
        } else {
            logger.info('Got project ', data);
            deferred.resolve(data.Items);
        }
      });
    },

    getProjectsForUser: function(username) {
      var deferred = q.defer();

      logger.info('getting projects for user ' + username);

      var params = {
        TableName: schema.project.tablename,
        KeyConditionExpression: 'userId = :u',
        ExpressionAttributeValues: {
            ':u': username
        }
      };

      db.query(params, function(err, data) {
        if (err) {
            logger.error('Unable to query projects for user ' + username + ' with error ', err);
            deferred.reject(new Error(err));
        } else {
            logger.info('Got query results ', data);
            deferred.resolve(data.Items);
        }
      });
      return deferred.promise;
    },

    deleteProject: function(username, projectId) {
      var deferred = q.defer();
      var params = {
        TableName: schema.project.tablename,
        Key: {
            'projectId': projectId,
            'username': username
        }
      };

      db.delete(params, function(err, data) {
        if (err) {
            logger.error('Unable to delete project ' + projectId + ' for user ' + username + ' with error ', err);
            deferred.reject(new Error(err));
        } else {
            logger.info('Deleted project ', data);
            deferred.resolve(data.Items);
        }
      });
      return deferred.promise;
    },

    searchProjects: function(query) {
      logger.info('searching projects with query ' + query);
      var deferred = q.defer();
      var params = { TableName: schema.project.tablename };

      db.scan(params, function(err, data) {
       if (err) {
         logger.error('Failed to get contacts with error ', err);
         deferred.reject(new Error(err));
       } else {
         var results = data.Items.filter((project) =>
           existsAndIncludes(project.subhead, query)
           || existsAndIncludes(project.name, query)
           || existsAndIncludes(project.description, query));
         deferred.resolve(results);
       }
      });

      return deferred.promise;
    }

  };
};
