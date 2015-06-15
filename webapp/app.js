var yodelApp = angular.module("yodel", [
    'about',
    'events',
    'ionic',
    'ui.router',
    'login',
    'profile',
    'nav',
    'ngMessages',
    'signup'
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
    '$location',
    '$rootScope',
    '$q',
    '$window',
    function ($location, $rootScope, $q, $window) {
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
                if (response.status === 401 && $location.url() !== '/login') {
                    $location.url('/login');
                }
                return response || $q.when(response);
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
            state('profile', {
                url: '/profile/:username',
                templateUrl: '/partials/profile/profile.html',
                controller: 'ProfileCtrl'
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
            });

        $httpProvider.interceptors.push('jwtAuthInterceptor');
    }
]);
