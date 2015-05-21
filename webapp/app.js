var yodelApp = angular.module("yodel", [
    'about',
    'events',
    'ui.router',
    'profile',
    'nav'
]);

yodelApp.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/events');
        $stateProvider.
            state('events', {
                url: '/events',
                templateUrl: '/partials/events-browser/events.html',
                controller: 'EventsCtrl'
            }).
            state('profile', {
                url: '/profile',
                templateUrl: '/partials/profile/profile.html',
                controller: 'ProfileCtrl'
            }).
            state('about', {
                url: '/about',
                templateUrl: '/partials/about/about.html',
                controller: 'AboutCtrl'
            });
    }
]);
