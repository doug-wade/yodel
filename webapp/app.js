var yodelApp = angular.module("yodel", [
    'about',
    'events',
    'ngRoute',
    'profile',
    'nav'
]);

yodelApp.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/events', {
                templateUrl: '/partials/events-browser/events.html',
                controller: 'EventsCtrl'
            }).
            when('/profile', {
                templateUrl: '/partials/profile/profile.html',
                controller: 'ProfileCtrl'
            }).
            when('/about', {
                templateUrl: '/partials/about/about.html',
                controller: 'AboutCtrl'
            }).
            otherwise({
                redirectTo: '/events'
            });
    }
]);
