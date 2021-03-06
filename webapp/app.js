let yodelApp = angular.module('yodel', [
  'about',
  'checklist-model',
  'events',
  'ionic',
  'layout',
  'login',
  'nav',
  'ngMessages',
  'ngS3upload',
  'ngSanitize',
  'ngTagsInput',
  'portfolio',
  'profile',
  'projects',
  'signup-info',
  'signup',
  'ui.router',
  'ui.select'
]);

function appRun($ionicPlatform, $window) {
  $ionicPlatform.ready(function() {
    if ($window.cordova && $window.cordova.plugins.Keyboard) {
      $window.cordova.pluging.Keyboard.hideKeyboardAccessBar(true);
    }
    if ($window.StatusBar) {
      $window.StatusBar.styleDefault();
    }
  });
}

yodelApp.run(['$ionicPlatform', '$window', appRun]);

yodelApp.factory('jwtAuthInterceptor', [
  '$injector',
  '$rootScope',
  '$q',
  '$window',
  ($injector, $rootScope, $q, $window) => {
    return {
      request: (config) => {
        config.headers = config.headers || {};
        if ($window.sessionStorage.token) {
          config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
        }
        return config;
      },
      response: (response) => {
        // TODO add a success toast
        return response || $q.when(response);
      },
      responseError: (response) => {
        let $state = $injector.get('$state');
        if (response.status === 401 && $state.current.name !== 'login') {
          $state.go('login');
        }
        return $q.reject(response);
      }
    };
  }
]);

yodelApp.config([
    '$httpProvider',
    '$stateProvider',
    '$urlRouterProvider',
    function($httpProvider, $stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/y/about');
        $stateProvider.
            state('yodel', {
                url: '/y',
                abstract: true,
                templateUrl: '/partials/nav/nav.html',
                controller: 'NavCtrl'
            }).
            state('yodel.events', {
                url: '/events',
                views: {
                    'yodelContent': {
                        templateUrl: '/partials/events-browser/events.html',
                        controller: 'EventsCtrl'
                    }
                }
            }).
            // TODO redirect a user from /profile to /profile/username (pull the username from the $rootScope)
            state('yodel.profile', {
                url: '/profile/:username',
                views: {
                    'yodelContent': {
                        templateUrl: '/partials/profile/profile.html',
                        controller: 'ProfileCtrl'
                    }
                }
            }).
            state('yodel.portfolio', {
                url: '/profile/:username/portfolio/:portfolio',
                views: {
                    'yodelContent': {
                        templateUrl: '/partials/portfolio/portfolio.html',
                        controller: 'PortfolioCtrl'
                    }
                }
            }).
            state('yodel.projects', {
                url: '/profile/:username/projects',
                views: {
                    'yodelContent': {
                        templateUrl: '/partials/projects/projects.html',
                        controller: 'ProjectsCtrl'
                    }
                }
            }).
            state('yodel.createPortfolio', {
                url: '/profile/:username/create-portfolio',
                views: {
                    'yodelContent': {
                        templateUrl: '/partials/portfolio/create/create-portfolio.html',
                        controller: 'CreatePortfolioCtrl'
                    }
                }
            }).
            state('yodel.about', {
                url: '/about',
                views: {
                    'yodelContent': {
                        templateUrl: '/partials/about/about.html',
                        controller: 'AboutCtrl'
                    }
                }
            }).
            state('login', {
                url: '/login',
                templateUrl: '/partials/login/login.html',
                controller: 'LoginCtrl'
            }).
            state('signup', {
                url: '/signup',
                templateUrl: '/partials/signup/signup.html',
                controller: 'SignupCtrl'
            }).
            state('signup-info', {
                url: '/signup-info',
                templateUrl: '/partials/signup-info/signup-info.html',
                conroller: 'SignupInfoCtrl'
            });

    $httpProvider.interceptors.push('jwtAuthInterceptor');

    // TODO if a user reloads the page, the $rootScope is wiped even if $window.sessionStorage.token still exists (and contains the username); we should re-create the $rootScope username state from the JWT token in this case
  }
]);

// To add a new feature, give it a random 8 digit id.
// Math.floor(Math.random() * (100000000))
yodelApp.constant('FEATURE', {
  isEnabled(featureId) {
    let enabled = [];
    return enabled.indexOf(featureId) >= 0;
  },
  'ADD_PORTFOLIO': 47415668,
  'MULTIPART_UPLOAD': 19763530
});

yodelApp.run([
  '$rootScope',
  '$window',
  ($rootScope, $window) => {
    if ($window && $window.sessionStorage && $window.sessionStorage.token) {
      // TODO get this out of the token if the token is still valid (not expired)
      $rootScope.username = $window.sessionStorage.username;
    }
  }
]);
