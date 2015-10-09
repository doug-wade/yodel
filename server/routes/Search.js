var db = require('../util/db.js');
var logger = require('../logger.js');

/**
 * Creates a controller for handling search.
 *
 * @class SearchController
 * @classdesc A controller for handling search
 */
export class SearchController {
  /**
   * Performs a search for users and projects that match a given search term.
   *
   * @todo Search should use Levenshtein distance instead of a strict substring match.
   * @todo Set up a solr cluster for search.
   * @todo Add matechText and matchedProperty to allow search term highlighting.
   * @example
   *     POST /search
   *     BODY { 'query' }
   *     RETURNS {
   *     }
   */
  _search() {
    return function*() {
      var query = this.params.query;
      var results = [];

      db.searchUsers(query).forEach((user) =>
        results.push({
          'type': 'user',
          'label': user.username,
          'matchedText': user.username,
          'matchedProperty': 'username' })
      );
      db.searchProjects(query).forEach((project) =>
        results.push({
          type: 'project',
          label: project.name,
          'matchedText': 'implement this',
          'matchedProperty': 'implement this'
        })
      );

      logger.info('Got results ', results, ' for query ', query);

      this.body = { results: results };
    };
  }

  /**
   * Registers routes on the router.
   *
   * @param {Object} router the koa router object.
   */
  register(router) {
    router.get('/search/:query', this._search());
  }
}
