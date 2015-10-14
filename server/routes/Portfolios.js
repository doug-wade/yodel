var config = require('../config');
import {PortfolioDao} from '../dao/Portfolio';

/**
 * Creates a controller for handling portfolios.
 *
 * @class PortfolioController
 * @classdesc A controller for handling portfolios
 */
export class PortfolioController {
  constructor() {
    this.portfolioDao = new PortfolioDao();
  }

  /**
   * Get all portfolios for a user.
   *
   * @example
   *     GET /user/ivan/portfolio
   *     RETURN [{
   *       username: 'ivan',
   *       portfolioId: '12eed989-4fcc-42cf-b2c2-c8a4426ee3b6',
   *       imageUrl: '/images/ivan/seattle.jpg',
   *       title: 'Sounds of Seattle',
   *       createdDate: 1441152000000,
   *       description: "There ain't no riot here...",
   *       items: [{
   *         itemId: '77737fce-524e-49b1-8480-6dc5923cb6d3',
   *         createdDate: 1441152000000,
   *         resourceUrl: '/images/ivan/edibles.jpg',
   *         resourceType: 'picture',
   *         caption: 'edibles',
   *         likes: 1000000,
   *         comments: 0
   *       }]
   *     }]
   */
  _getUserPortfolios() {
    return function*() {

      this.body = [];
      let portfolios = yield this.portfolioDao.getUserPortfolios(this.params.username);
      if (portfolios) {
        this.body.concat(portfolios);
      }
    };
  }

  /**
   * Get all items from a single portfolio.
   *
   * @example
   *     GET /user/ivan/portfolio/12eed989-4fcc-42cf-b2c2-c8a4426ee3b6/nextToken/0
   *     RETURN [{
   *         itemId: '77737fce-524e-49b1-8480-6dc5923cb6d3',
   *         createdDate: 1441152000000,
   *         resourceUrl: '/images/ivan/edibles.jpg',
   *         resourceType: 'picture',
   *         caption: 'edibles',
   *         likes: 1000000,
   *         comments: 0
   *     }]
   * @todo pagination
   */
 _getPortfolioItems() {
    return function*() {
      this.body = [];
      let portfolio = yield this.portfolioDao.getPortfolio(this.params.username, this.params.portfolio);
      let portfolioItems = portfolio.items;

      if (portfolioItems) {
        this.body.concat(portfolioItems);
      }
    };
  }

  /**
   * Add a new item to an existing portfolio.
   *
   * @example
   *     POST /user/ivan/portfolio/12eed989-4fcc-42cf-b2c2-c8a4426ee3b6/nextToken/0
   *     BODY {
   *         resourceUrl: '/images/ivan/edibles.jpg',
   *         resourceType: 'picture',
   *         caption: 'edibles',
   *         likes: 1000000,
   *         comments: 0
   *     }
   *     RETURN {
   *         itemId: '77737fce-524e-49b1-8480-6dc5923cb6d3',
   *         createdDate: 1441152000000,
   *         resourceUrl: '/images/ivan/edibles.jpg',
   *         resourceType: 'picture',
   *         caption: 'edibles',
   *         likes: 1000000,
   *         comments: 0
   *     }
   */
  _addItemToPortfolio() {
    return function*() {
      let username = this.params.username;
      let portfolioId = this.params.portfolio;
      let item = this.request.body;

      this.body = yield this.portfolioDao.addItemToPortfolio(username, portfolioId, item.imageUrl, item.caption);
    };
  }

  /**
   * Deletes an item from an existing porfolio.
   *
   * @example
   *     DELETE /user/ivan/portfolio/12eed989-4fcc-42cf-b2c2-c8a4426ee3b6/item/77737fce-524e-49b1-8480-6dc5923cb6d3
   *     RETURN { status: 200, message: 'success' }
   */
  _deleteItemFromPortfolio() {
    return function*() {
      this.portfolioDao.deleteItemFromPortfolio(this.params.username, this.params.portfolio, this.params.itemId);
      this.body = config.jsonSuccess;
    };
  }

  /**
   * Create a portfolio for a user.
   *
   * @example
   *     POST /user/ivan/portfolio
   *     BODY {
   *       username: 'ivan',
   *       imageUrl: '/images/ivan/seattle.jpg',
   *       title: 'Sounds of Seattle',
   *       description: "There ain't no riot here...",
   *       items: [{
   *         resourceUrl: '/images/ivan/edibles.jpg',
   *         resourceType: 'picture',
   *         caption: 'edibles',
   *         likes: 1000000,
   *         comments: 0
   *       }]
   *     }
   *     RETURN {
   *       username: 'ivan',
   *       portfolioId: '12eed989-4fcc-42cf-b2c2-c8a4426ee3b6',
   *       imageUrl: '/images/ivan/seattle.jpg',
   *       title: 'Sounds of Seattle',
   *       createdDate: 1441152000000,
   *       description: "There ain't no riot here..."
   *       items: [{
   *         itemId: '77737fce-524e-49b1-8480-6dc5923cb6d3',
   *         createdDate: 1441152000000,
   *         resourceUrl: '/images/ivan/edibles.jpg',
   *         resourceType: 'picture',
   *         caption: 'edibles',
   *         likes: 1000000,
   *         comments: 0
   *       }]
   *     }
   */
  _createPortfolio() {
    return function*() {
      let username = this.params.username;
      let portfolio = this.request.body;

      this.body = yield this.portfolioDao.createPortfolio(username, portfolio.title, portfolio.description, portfolio.imageUrl, portfolio.items);
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
    router.get('/user/:username/portfolio', this._getUserPortfolios());
    router.get('/user/:username/portfolio/:portfolio/nextToken/:nextToken', this._getPortfolioItems());
  }
}
