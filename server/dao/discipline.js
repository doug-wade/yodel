var logger = require('../logger.js');
var uuid   = require('node-uuid');
var q = require('q');
var schema = require('../../config/schema');

module.exports = function(db) {
  return {
    addDisciplines: function(/* Object[] */ disciplinesToAdd) {
      var deferred = q.defer();

      return q.all(disciplinesToAdd.map(function(discipline) {
        discipline.disciplineId = uuid.v4();
        discipline.created = new Date().getTime();

        var params = {
          TableName: schema.discipline.tablename,
          Item: discipline
        };

        db.put(params, function(err, data) {
           if (err) {
             logger.error('Failed to add discipline ' + discipline.text + ' with error ', err);
             deferred.reject(err);
           } else {
             logger.info('Added discipline to db ', discipline);
             deferred.resolve(data);
           }
        });

        return deferred.promise;
      }));
    },

    getAllDisciplines: function() {
      var deferred = q.defer();

      var params = {
        TableName: schema.discipline.tablename
      };

      db.scan(params, function(err, data) {
        if (err) {
          logger.error('Failed to get disciplines from db with error', err);
          deferred.reject(new Error(err));
        } else {
          deferred.resolve(data.Items);
        }
      });

      return deferred.promise;
    }
  };
};
