var aws = require('aws-sdk');
var config = require('../config');
var consolidate = require('consolidate');
var logger = require('../logger.js');
var path = require('path');

aws.config.update({
  region: config.aws.region,
  endpoint: config.aws.sesEndpoint
});

var ses = new aws.SES();

module.exports = {
  /**
   * Sends a plain text email.
   * @param {string} to the email address to send the email to
   * @param {string} subject the subject of the email
   * @param {string} body the plain text body of the email
   */
  sendPlainTextEmail: function(to, subject, body){
    logger.info('sending email to ' + to + ' regarding ' + subject);
    var params = {
      Destination: {
        ToAddresses: [ to ]
      },
      Message: {
        Body: {
          Text: {
            Data: body,
            Charset: config.encoding
          }
        },
        Subject: {
          Data: subject,
          Charset: config.encoding
        }
      },
      Source: config.noreply,
      ReplyToAddresses: [ config.noreply ],
      ReturnPathArn: config.sesArn,
      SourceArn: config.sesArn
    };
    ses.sendEmail(params, function(err, data) {
      if (err) { logger.error(err); }
      else     { logger.info(data); }
    });
  },

  /**
   * Sends an html text email
   * @param {string} to the email address to send the email to
   * @param {string} subject the subject of the email
   * @param {string} filepath the path to the template file
   * @param {Object} opts the values to provide to the templating engine
   */
  sendHtmlEmailFromTemplate: function(to, subject, filepath, opts){
    filepath = path.resolve(path.join('templates', filepath));
    logger.info('sending email to ' + to + ' regarding ' + subject + ' from template ' + filepath);

    opts.to = to;
    opts.subject = subject;

    consolidate.lodash(filepath, opts, function(err, html) {
      if (err) {
        logger.error(err);
        return;
      }
      logger.debug('generated email body' + html);
      var params = {
        Destination: {
          ToAddresses: [ to ]
        },
        Message: {
          Body: {
            Html: {
              Data: html,
              Charset: config.encoding
            }
          },
          Subject: {
            Data: subject,
            Charset: config.encoding
          }
        },
        Source: config.noreply,
        ReplyToAddresses: [ config.noreply ],
        ReturnPathArn: config.sesArn,
        SourceArn: config.sesArn
      };

      ses.sendEmail(params, function(innerErr, data) {
        if (err) { logger.error(innerErr); }
        else     { logger.info(data);      }
      });
    });
  }
};
