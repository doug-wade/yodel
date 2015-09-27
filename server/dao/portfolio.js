var logger = require('../logger.js');
var uuid   = require('node-uuid');
var schema = require('../../config/schema');
var q = require('q');
var {existsAndIncludes} = require('../util/predicates');

module.exports = function(db) {
  return {
    getUserPortfolios: function(/* String */ username) {
      var portfolios = db.getCollection(schema.portfolios);
      return portfolios.find({ 'username': username });
    },

    getPortfolioItems: function( /* String */ username, /* Object */ portfolio, /* int */ offset) {
      return [];
    },

    addItemToPortfolio: function(/* String */ username, /* String */ portfolio, /* String */ uploadKey, /* String */ caption) {
      if (!testData.userPortfolioItems[username]) {
        testData.userPortfolioItems[username] = {};
      }
      if (!testData.userPortfolioItems[username][portfolio]) {
        testData.userPortfolioItems[username][portfolio] = [];
      }

      var portfolioArr = testData.userPortfolioItems[username][portfolio];
      var newIndex = testData.portfolioArr[portfolioArr.length - 1].itemId + 1;

      var newItem = {
          itemId: newIndex,
          resourceUrl: uploadKey,
          resourceType: 'picture',
          caption: caption,
          likes: 0,
          comments: 0
      };
      portfolioArr.push(newItem);
      return newItem;
    },

    deleteItemFromPortfolio: function(/* String */ username, /* String */ portfolio, /* Int */ itemId) {
      itemId = +itemId || -1;
      var index = -1;

      if (testData.userPortfolioItems[username] && testData.userPortfolioItems[username][portfolio]) {
        index = testData.userPortfolioItems[username][portfolio].findIndex(function(elem) {
          return elem.itemId === itemId;
        });
      }

      if (index >= 0) {
        testData.userPortfolioItems[username][portfolio].splice(index, 1);
      }
    },

    createPortfolio: function(
        /* String */ username,
        /* String */ portfolioTitle,
        /* Date */ createDate,
        /* String */ description,
        /* String */ uploadKey) {
      var portfolios = db.getCollection(schema.portfolios);
      var portfolio = {
        imageUrl: uploadKey,
        title: portfolioTitle,
        date: createDate,
        description: description
      };
      portfolios.add(portfolio);
    }
  };
};
