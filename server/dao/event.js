var logger = require('../logger.js');
var uuid   = require('node-uuid');
var q = require('q');
var schema = require('../../config/schema');

module.exports = function(db) {
  return {
    addEvent: function(event) {
      var deferred = q.defer();

      event.eventId = uuid.v4();
      event.created = new Date().getTime();

      var params = {
        TableName: schema.event.tablename
      };

      db.put(params, function(err, data) {
        if (err) {
          logger.error('Failed to create event ', event, ' with error ', err);
          deferred.reject(new Error(err));
        } else {
          deferred.resolve(data.Items);
        }
      });

      return deferred.promise;
    },

    getEvents: function() {
      var deferred = q.defer();

      var params = {
        TableName: schema.event.tablename
      };

      db.scan(params, function(err, data) {
        if (err) {
          logger.error('Failed to get all events due to error ', err);
          deferred.reject(new Error(err));
        } else {
          deferred.resolve(data.Items);
        }
      });

      return deferred.promise;
    }
  };
};
