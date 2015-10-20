var blob = require('../util/blob');
var config = require('../config');
var db = require('../util/db');
var multiparse = require('co-busboy');

/**
 * Creates a controller for handling portfolios.
 *
 * @class PortfolioController
 * @classdesc A controller for handling portfolios
 */
export class PortfolioController {
  /**
   * Get all portfolios for a user.
   */
  _getUserPortfolio() {
    return function*() {

      this.body = [];
      var portfolios = db.getUserPortfolios(this.params.username);
      if (portfolios) {
        this.body = portfolios;
      }
    };
  }

  /**
   * Get all items in a portfolio.
   */
 _getPortfolioItems() {
    return function*() {

      var offset = +this.params.nextToken || 0;
      var portfolioItems = db.getPortfolioItems(this.params.username, this.params.portfolio, offset);

      if (portfolioItems) {
        this.body = portfolioItems;
      }
    };
  }

  /**
   * Add a new item to an existing portfolio.
   */
  _addItemToPortfolio() {
    return function*() {
      var portfolios = db.getUserPortfolios(this.params.username);
      if (!portfolios) {
          this.body = 'user has no portfolio';
          this.status = 400;
          return;
      }

      var parts = multiparse(this);
      var part;
      var addItemParams;
      var context = {};
      var uploadKey = this.params.username + '/' + (Date.now());
      var upload = blob.getUploadWriteStream(uploadKey);

      while (part = yield parts) {
        if (part.length && part[0] === 'createParams') {
          addItemParams = JSON.parse(part[1]);
          checkParams('caption').notEmpty();

          if (context.errors) {
            this.status = 400;
            this.body = context.errors;
            return;
          }
        } else {
          part.pipe(upload);
        }
      }

      this.body = db.addItemToPortfolio(this.params.username, this.params.portfolio, uploadKey, addItemParams.caption);

      function checkParams(key) {
        return new validate.Validator(context, key, addItemParams[key], key in addItemParams, addItemParams);
      }
    };
  }

  /**
   * Deletes an item from an existing porfolio.
   */
  _deleteItemFromPortfolio() {
    return function*() {
      db.deleteItemFromPortfolio(this.params.username, this.params.portfolio, this.params.itemId);
      this.body = config.jsonSuccess;
    };
  }

  /**
   * Creates a portfolio.
   */
  _createPortfolio() {
    return function*() {
      if (!this.request.is('multipart/*')) {
        this.body = 'must upload file';
        this.status = 400;
        return;
      }

      var parts = multiparse(this);
      var part;
      var createParams;
      var context = {};
      var uploadKey = username + '/' + (Date.now());
      var upload = blob.getUploadWriteStream(uploadKey);

      while (part = yield parts) {
        if (part.length && part[0] === 'createParams') {
          createParams = JSON.parse(part[1]);
          checkParams('title').notEmpty();
          checkParams('date').isDate();

          if (context.errors) {
            this.status = 400;
            this.body = context.errors;
            return;
          }
        } else {
          part.pipe(upload);
        }
      }

      db.createPortfolio(this.params.username, createParams.title, createParams.date, createParams.description, uploadKey);
      this.body = '"success"';

      function checkParams(key) {
        return new validate.Validator(context, key, createParams[key], key in createParams, createParams);
      }
    };
  }

  /**
   * Registers routes on the router.
   *
   * @param {Object} router the koa router object.
   */
  register(router) {
    router.post('/user/:username/portfolio', this._createPortfolio());
    router.del('/user/:username/portfolio/:portfolio/item/:itemId', this._deleteItemFromPortfolio());
    router.post('/user/:username/portfolio/:portfolio/item', this._addItemToPortfolio());
    router.get('/user/:username/portfolio', this._getUserPortfolio());
    router.get('/user/:username/portfolio/:portfolio/nextToken/:nextToken', this._getPortfolioItems());
  }
}
