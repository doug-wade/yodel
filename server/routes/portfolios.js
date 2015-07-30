var db = require('../util/db.js');
var blob = require('../util/blob.js');

function* getUserPortfolio() {
  // TODO check authorization (access control)

  this.body = [];
  var portfolios = db.getUserPortfolios(this.params.username);
  if (portfolios) {
    this.body = portfolios;
  }
}

function* getPortfolioItems() {
  // TODO check authorization (access control)

  var offset = +this.params.nextToken || 0;
  var maxItemsToReturn = 2;
  this.body = {
    items: []
  };
  var portfolioItems = db.getPortfolioItems(this.params.username, this.params.portfolio, offset);

  if (portfolioItems) {
    this.body = portfolioItems;
  }
}

function* addItemToPortfolio() {
  // TODO check authorization (access control)
  if (!this.request.is('multipart/*')) {
      this.body = 'must upload file';
      this.status = 400;
      return;
  }

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
  var uploadKey = username + '/' + (Date.now());
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
}

function* deleteItemFromPortfolio() {
  // TODO check authorization (access control)
  // TODO check to make sure portfolio exists
  db.deleteItemFromPortfolio(this.params.username, this.params.portfolio, this.params.itemId);
  this.body = [];
}

function* createPortfolio() {
  // TODO check authorization (access control)
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
}

module.exports = {
  getUserPortfolio: getUserPortfolio,
  getPortfolioItems: getPortfolioItems,
  addItemToPortfolio: addItemToPortfolio,
  deleteItemFromPortfolio: deleteItemFromPortfolio,
  createPortfolio: createPortfolio
};
