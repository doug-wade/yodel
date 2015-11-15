var logger = require('../logger.js');
var uuid   = require('node-uuid');
var q = require('q');
var schema = require('../config').schema;

module.exports = function(db) {
  return {
    /**
     * Adds a single discipline to the database.
     * @author Doug Wade
     */
    addDiscipline: function(/* Object */ disciplineToAdd) {
      var deferred = q.defer();
      disciplineToAdd.disciplineId = uuid.v4();
      disciplineToAdd.created = new Date().getTime();

      var params = {
        TableName: schema.discipline.tablename,
        Item: disciplineToAdd
      };

      db.put(params, function(err, data) {
         if (err) {
           logger.error('Failed to add discipline ' + disciplineToAdd.text + ' with error ', err);
           deferred.reject(err);
         } else {
           logger.info('Added discipline to db ', disciplineToAdd);
           deferred.resolve(data);
         }
      });

      return deferred.promise;
    },

    /**
     * Adds an array of disciplines to the database
     * @author Doug Wade
     */
    addDisciplines: function(/* Object[] */ disciplinesToAdd) {
      return q.all(disciplinesToAdd.map(function(discipline) {
        this.addDiscipline(discipline);
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
