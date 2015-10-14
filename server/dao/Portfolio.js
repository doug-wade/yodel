var logger = require('../logger.js');
var uuid   = require('node-uuid');
var schema = require('../../config/schema');

import {ClientFactory} from '../util/ClientFactory';

/**
 * A data access object for handling portfolios.
 *
 * @class PortfolioDao
 * @classdesc A data access object for handling portfolios.
 */
export class PortfolioDao {
  constructor() {
    this.clientFactory = new ClientFactory();
  }

  /**
   * Gets all portfolios for a user.
   *
   * @param {String} username the user for whom to get portfolios.
   */
  getUserPortfolios(username) {
    return new Promise((resolve, reject) => {
      let params = {
        TableName: schema.portfolio.tablename,
        Key: {
          'username': username
        }
      };

      let client = this.clientFactory.getDdbClient();
      client.get(params, (err, data) => {
        if (err) {
            logger.error('Unable to get portfolios for user ' + username + ' with error ', err);
            reject(new Error(err));
        } else {
            logger.info('Got ' + data.Items.length + ' portfolios for user ' + username);
            resolve(data.Items);
        }
      });
    });
  }

  /**
   * Gets a portfolio.
   *
   * @param {String} username the user for whom to get portfolios.
   * @param {String} portfolioId the uuid that identifies the portfolio.
   */
  getPortfolio(username, portfolioId) {
    return new Promise((resolve, reject) => {
      let params = {
        TableName: schema.portfolio.tablename,
        Key: {
          'username': username,
          'portfolioId': portfolioId
        }
      };

      let client = this.clientFactory.getDdbClient();
      client.get(params, (err, data) => {
        if (err) {
            logger.error('Unable to get portfolio ' + portfolioId + ' for user ' + username + ' with error ', err);
            reject(new Error(err));
        } else {
            logger.info('Got portfolio ' + data.name + ' for user ' + username);
            resolve(data.Items);
        }
      });
    });
  }

  /**
   * Creates a new portfolio.
   *
   * @param {String} username the user that created the portfolio.
   * @param {String} portfolioTitle the title for the portfolio.
   * @param {String} description the portfolio description.
   * @param {String} imageUrl the S3 url for the image portfolio.
   * @returns {Promise} a promise for the portfolio persisted.
   */
  createPortfolio(username, portfolioTitle, description, imageUrl, items) {
    return new Promise((resolve, reject) => {
      let portfolioId = uuid.v4();
      let createdDate = new Date();

      items = items || [];
      items = items.map((item) => {
        item.createdDate = createdDate;
        item.itemId = uuid.v4();
      });

      let portfolio = {
        createdDate: createdDate,
        username: username,
        title: portfolioTitle,
        description: description,
        imageUrl: imageUrl,
        id: portfolioId,
        items: items
      };
      let params = {
        TableName: schema.portfolio.tablename,
        Item: portfolio
      };

      let client = this.clientFactory.getDdbClient();
      client.put(params, (err) => {
        if (err) {
            logger.error('Unable to create portfolio ' + portfolioTitle + ' for user ' + username + ' with error ', err);
            reject(new Error(err));
        } else {
            logger.info('Created portfolio for user ' + username, portfolio);
            resolve(portfolio);
        }
      });
    });
  }

  /**
   * Adds an item to an existing portfolio.
   *
   * @param {String} username The user that owns the portfolio.
   * @param {String} portfolioId The uuid v4 that identifies this portfolio.
   * @param {String} imageUrl The url of the image that is associated with this portfolio item.
   * @param {String} caption The caption associated for the portfolio item.
   * @return {Promise} A promise that resolves with the item as persisted.
   */
  addItemToPortfolio(username, portfolioId, imageUrl, caption) {
    return new Promise((resolve, reject) => {
      let getParams = {
        TableName: schema.portfolio.tablename,
        Key: {
          'username': username,
          'portfolioId': portfolioId
        }
      };

      let client = this.clientFactory.getDdbClient();
      let itemId = uuid.v4();
      let item = {
        imageUrl: imageUrl,
        caption: caption,
        id: itemId
      };

      client.get(getParams, (getErr, data) => {
        if (getErr) {
          logger.error('Unable to get portfolio ' + portfolioId + ' for user ' + username + ' with error ', getErr);
          reject(new Error(getErr));
        } else {
          let updatedPortfolio = data;
          updatedPortfolio.items.push(item);
          let putParams = {
            TableName: schema.portfolio.tablename,
            Item: updatedPortfolio
          };

          client.put(putParams, (putErr) => {
            if (putErr) {
                logger.error('Unable to put updated portfolio ' + portfolioId + ' with new item ' + itemId + ' with error ', putErr);
                reject(new Error(putErr));
            } else {
              logger.info('Added item to portfolio ' + portfolioId, item);
              resolve(item);
            }
          });
        }
      });
    });
  }

  /**
   * Deletes an existing item from an existing portfolio.
   *
   * @param {String} username The user that owns the portfolio.
   * @param {String} portfolioId The uuid v4 that identifies this portfolio.
   * @param {String} itemId The uuid v4 that identifies the item to be deleted.
   * @return {Promise} A promise that resolves with the item as persisted.
   */
  deleteItemFromPortfolio(username, portfolioId, itemId) {
    return new Promise((resolve, reject) => {
      let getParams = {
        TableName: schema.portfolio.tablename,
        Key: {
          'username': username,
          'portfolioId': portfolioId
        }
      };

      let client = this.clientFactory.getDdbClient();

      client.get(getParams, (getErr, data) => {
        if (getErr) {
          logger.error('Unable to get portfolio ' + portfolioId + ' for user ' + username + ' with error ', getErr);
          reject(new Error(getErr));
        } else {
          let updatedPortfolio = data;
          updatedPortfolio.items = updatedPortfolio.items.filter((item) => { return item.id !== itemId; });

          let putParams = {
            TableName: schema.portfolio.tablename,
            Item: updatedPortfolio
          };

          client.put(putParams, (putErr) => {
            if (putErr) {
                logger.error('Unable to put updated portfolio ' + portfolioId + ' with new item ' + itemId + ' with error ', putErr);
                reject(new Error(putErr));
            } else {
              logger.info('Deleted item ' + itemId + ' from portfolio ' + portfolioId);
              resolve(itemId);
            }
          });
        }
      });
    });
  }
}
