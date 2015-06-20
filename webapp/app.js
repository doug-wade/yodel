var yodelApp = angular.module("yodel", [
    'about',
    'events',
    'ionic',
    'ui.router',
    'login',
    'profile',
    'portfolio',
    'nav',
    'ngMessages',
    'signup',
    'signup-info'
]);

yodelApp.run(
    function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.pluging.Keyboard.hideKeyboardAccessBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    }
);

yodelApp.factory('jwtAuthInterceptor', [
    '$injector',
    '$rootScope',
    '$q',
    '$window',
    function ($injector, $rootScope, $q, $window) {
        return {
            request: function(config) {
                config.headers = config.headers || {};
                if ($window.sessionStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                }
                return config;
            },
            response: function(response) {
                // TODO add a success toast
                return response || $q.when(response);
            },
            responseError: function(response) {
                var $state = $injector.get('$state');
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
        $urlRouterProvider.otherwise('/events');
        $stateProvider.
            state('events', {
                url: '/events',
                templateUrl: '/partials/events-browser/events.html',
                controller: 'EventsCtrl'
            }).
            // TODO redirect a user from /profile to /profile/username (pull the username from the $rootScope)
            state('profile', {
                url: '/profile/:username',
                templateUrl: '/partials/profile/profile.html',
                controller: 'ProfileCtrl'
            }).
            state('portfolio', {
                url: '/profile/:username/portfolio/:portfolio',
                templateUrl: '/partials/portfolio/portfolio.html',
                controller: 'PortfolioCtrl'
            }).
            state('about', {
                url: '/about',
                templateUrl: '/partials/about/about.html',
                controller: 'AboutCtrl'
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
