var config = require('../config.js');
var db = require('../util/db.js');
var logger = require('../logger.js');
var ses = require('../util/ses.js');

/**
 * Get a simple plain text email to thank a user for signing up for the beta.
 * @param {Object} contact the contact object for the user to contact.
 */
function getSimpleThankYouEmail(contact) {
  var emailBody = '';
  [
    contact.name,
    '',
    'Thank you for signing up for the Yodel Beta!  We are currently working to prepare the beta.  Look for us to issue you a beta key in January, 2016!',
    '',
    'All the best,',
    'The Yodel Team'
  ].map((line) => {
    emailBody += line + '\n';
  });
  return emailBody;
}

/**
 * Creates a controller for handling contacts.
 * @class ContactUsController
 * @classdesc A controller for handling contacts
 */
export class ContactUsController {
  /**
   * Create a contact. Adds a created field with the server time and persists it.  Must not require a jwt token.
   * @example
   *     POST /contact-us
   *     BODY {name: "Gunter", email: "Gunter@yodel.to", types: ["creative", "patron"], desc: "Mwak mwak mwak"}
   *     RETURNS {status: 200, message: "success"}
   */
  _createContact() {
    return function*() {
      var contactInfo = this.request.body;
      contactInfo.created = new Date();
      logger.info(contactInfo);
      db.createContact(contactInfo);
      logger.info('Successfully created new contact; sending thank you email to ' + contactInfo.email);
      ses.sendPlainTextEmail(contactInfo.email, 'Thanks for signing up for the yodel beta', getSimpleThankYouEmail(contactInfo));
      this.body = config.jsonSuccess;
    };
  }

  /**
   * Registers routes on the router.
   * @param {Object} router the koa router object.
   */
  register(router) {
    router.post('/contact-us', this._createContact());
  }
}
