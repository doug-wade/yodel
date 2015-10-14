import {ContactUsController} from './ContactUs';
import {DisciplineController} from './Disciplines';
import {EventsController} from './Events';
import {LoginController} from './Login';
import {PortfolioController} from './Portfolios';
import {ProjectsController} from './Projects';
import {SearchController} from './Search';
import {S3UploadController} from './S3Upload';
import {SignupController} from './Signup';
import {UserDetailsController} from './UserDetails';

module.exports = function(router, jwt) {
  router.get('/', function*() {
    this.redirect('/index.html');
  });

  (new ContactUsController()).register(router);
  (new DisciplineController()).register(router);
  (new EventsController()).register(router);
  (new LoginController()).register(router, jwt);
  (new PortfolioController()).register(router);
  (new ProjectsController()).register(router);
  (new S3UploadController()).register(router);
  (new SearchController()).register(router);
  (new SignupController()).register(router, jwt);
  (new UserDetailsController()).register(router);
};
