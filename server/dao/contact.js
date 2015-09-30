var logger = require('../logger.js');
var uuid   = require('node-uuid');
var q = require('q');
var schema = require('../../config/schema');

module.exports = function(db) {
  return {
    createContact: function(contact) {
      var deferred = q.defer();

      contact.contactId = uuid.v4();
      contact.created = new Date().getTime();
      var params = {
        TableName: schema.contact.tablename,
        Item: contact
      };

      db.put(params, function(err, data) {
         if (err) {
           logger.error('Failed to add contact ', contact.email, ' with error ', err);
           deferred.reject(err);
         } else {
           logger.info('Created new contact: ', contact);
           deferred.resolve(data);
         }
      });

      return deferred.promise;
    },

    getContact: function(email){
      logger.info('Getting contact by email address');
      var deferred = q.defer();
      var params = {
        TableName: schema.contact.tablename,
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
            'email': email
        }
      };

      db.query(params, function(err, data) {
        if (err) {
          logger.error(err);
          deferred.reject(err);
        } else {
          deferred.resolve(data);
        }
      });

      return q.promise;
    },

    getContacts: function() {
      logger.info('Getting all contacts');
      var deferred = q.defer();
      var params = { TableName: schema.contact.tablename };

      db.scan(params, function(err, data) {
       if (err) {
         logger.error('Failed to get contacts with error ', err);
         deferred.reject(new Error(err));
       } else {
         deferred.resolve(data.Items);
       }
      });

      return deferred.promise;
    },

    assignBetaToken: function(contact, token) {
      var deferred = q.defer();

      var params = {
        TableName: schema.contact.tablename,
        Key: {
            email: contact.email,
            created: contact.created
        },
        UpdateExpression: 'set betaToken = :b',
        ExpressionAttributeValues: {
            ':b': token
        },
        ReturnValues: 'UPDATED_NEW'
      };

      db.update(params, function(err, data) {
        if (err) {
          logger.error('Unable to persist beta token ' + token + ' for contact ' + contact.name + ' with error ', err);
          deferred.reject(new Error(err));
        } else {
          logger.info('Persisted beta token ' + token + ' for contact ', contact);
          deferred.resolve(data);
        }
      });

      return deferred.promise;
    }
  };
};
