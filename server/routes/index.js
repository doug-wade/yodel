var blob = require('../util/blob.js');
var disciplines = require('./disciplines.js');
var login = require('./login.js');
var portfolios = require('./portfolios.js');
var projects = require('./projects.js');
var signup = require('./signup.js');
var userDetails = require('./user-details.js');

module.exports = function(router, jwt) {
  router.get("/", function*() {
    this.redirect("/index.html");
  });

  router.post('/login', login.login(jwt));
  router.post('/signup', signup.signup(jwt));

  router.get("/user/:username", userDetails.getUser);

  router.get("/user/:username/portfolio", portfolios.getUserPortfolio);
  router.get("/user/:username/portfolio/:portfolio/nextToken/:nextToken", portfolios.getPortfolioItems);
  router.post("/user/:username/portfolio/:portfolio/item", portfolios.addItemToPortfolio);
  router.del("/user/:username/portfolio/:portfolio/item/:itemId", portfolios.deleteItemFromPortfolio);
  router.post("/user/:username/portfolio", portfolios.createPortfolio);

  router.get("/resource/:username/:resourceId", function*() {
    // TODO how to determine the proper type
    this.body = blob.getDownloadReadStream(this.params.username, this.params.resourceId);
  });

  // TODO what does getting all disciplines have to do with the user?
  router.get("/user/:username/disciplines", disciplines.getUserDisciplines);
  router.post("/user/:username/disciplines", disciplines.setUserDisciplines);

  router.post("/user/:username/projects", projects.createProject);
  router.get("/user/:username/projects/:projectid", projects.getProject);
};