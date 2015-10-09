var blob = require('../util/blob.js');

import {ContactUsController} from './ContactUs';
import {DisciplineController} from './Disciplines';
import {EventsController} from './Events';
import {LoginController} from './Login';
import {PortfolioController} from './Portfolios';
import {ProjectsController} from './Projects';
import {SearchController} from './Search';
import {SignupController} from './Signup';
import {UserDetailsController} from './UserDetails';

module.exports = function(router, jwt) {
  router.get('/', function*() {
    this.redirect('/index.html');
  });

  router.get('/resource/:username/:resourceId', function*() {
    // TODO how to determine the proper type
    this.body = blob.getDownloadReadStream(this.params.username, this.params.resourceId);
  });

  (new ContactUsController()).register(router);
  (new DisciplineController()).register(router);
  (new EventsController()).register(router);
  (new LoginController()).register(router, jwt);
  (new PortfolioController()).register(router);
  (new ProjectsController()).register(router);
  (new SearchController()).register(router);
  (new SignupController()).register(router, jwt);
  (new UserDetailsController()).register(router);
};
