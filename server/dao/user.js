var logger = require('../logger.js');
var uuid   = require('node-uuid');
var q = require('q');
var schema = require('../config').schema;

module.exports = function(db) {
  return {
    addDisciplinesForUser: function(/* String */ username, /* Object[] */ disciplinesToAdd) {
      var deferred = q.defer();

      var params = {
        TableName: schema.user.tablename,
        Key: {
            userId: username
        },
        UpdateExpression: 'set disciplines = :d',
        ExpressionAttributeValues: {
            ':d': disciplinesToAdd
        },
        ReturnValues: 'UPDATED_NEW'
      };

      db.update(params, function(err, data) {
        if (err) {
          logger.error('Unable to persist user ' + username + ' with disciplines ' + disciplinesToAdd + ' with error ', err);
          deferred.reject(new Error(err));
        } else {
          logger.info('Persisted disciplines ' + disciplinesToAdd + ' for user ', username);
          deferred.resolve(data);
        }
      });

      return deferred.promise;
    },

    addUser: function(/* Object */ details) {
      var created, newUser, userId;
      userId = uuid.v4();
      created = new Date().getTime();
      newUser = {
        username: details.username,
        userId: userId,
        email: details.email,
        password: details.password,
        disciplines: [],
        created: created
      };
      logger.info('Inserting user into db', newUser);

      var params = {
        TableName: schema.user.tablename,
        Item: newUser
      };

      var deferred = q.defer();
      db.put(params, function(err) {
         if (err) {
           logger.error('Failed to add user ', newUser, ' with error ', err);
           deferred.reject(err);
         } else {
           logger.info('Created new project ', newUser);
           deferred.resolve(newUser);
         }
      });

      return deferred.promise;
    },

    searchUsers: function(/* String */ query) {
      logger.info('searching users with query ' + query);
      var deferred = q.defer();
      var params = { TableName: schema.user.tablename };

      db.scan(params, function(err, data) {
        if (err) {
          logger.error('Failed to get users with error ', err);
          deferred.reject(new Error(err));
        } else {
          var results = data.Items.filter((user) =>
            (user.username && user.username.includes(query)) || (user.fullName && user.fullName.includes(query)) ||
            (user.artistType && user.artistType.includes(query))
          ).map((user) => { return { 'username': user.username, 'email': user.email }; });

          deferred.resolve(results);
        }
      });

      return deferred.promise;
    },

    getAllUsers: function() {
      var deferred = q.defer();

      var params = {
        TableName: schema.user.tablename
      };

      db.scan(params, function(err, data) {
        if (err) {
          logger.error('Failed to get users from db with error', err);
          deferred.reject(new Error(err));
        } else {
          deferred.resolve(data.Items);
        }
      });

      return deferred.promise;
    },

    getUserByUsernameOrEmail: function(/* String */ query) {
      var deferred = q.defer();

      var params = {
        TableName: schema.user.tablename
      };

      // doug.wade 21/11/2015 -- query, don't scan
      db.scan(params, function(err, data) {
        if (err) {
          logger.error('Failed to get user ' + query + ' from db with error', err);
          deferred.reject(new Error(err));
        } else {
          var results = data.Items.filter((user) => user.username === query || user.email === query);
          deferred.resolve(results[0]);
        }
      });

      return deferred.promise;
    },

    getUserById: function(/* UUID */ userId) {
      var deferred = q.defer();

      var params = {
        TableName: schema.user.tablename,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            'userId': userId
        }
      };

      db.query(params, function(err, data) {
        if (err) {
          logger.error('Failed to get user ' + userId + ' from db with error', err);
          deferred.reject(new Error(err));
        } else {
          deferred.resolve(data.Items);
        }
      });

      return deferred.promise;
    }
  };
};
