var config = require('../config.js');
var db = require('../util/db.js');
var logger = require('../logger.js');
var ses = require('../util/ses.js');

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
      ses.sendHtmlEmailFromTemplate(contactInfo.email, 'Thanks for signing up for the yodel beta', 'beta-request.templ.html', contactInfo);
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
