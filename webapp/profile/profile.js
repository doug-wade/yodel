angular.module('profile',[
]).controller('ProfileCtrl', [
    '$http',
    '$q',
    '$scope',
    function($http, $q, $scope) {
        function initialize() {
            getUserDetails('ivan').then(function(response) { $scope.user = response.data; }, errorHandler);
            getUserPortfolios('ivan').then(function(response) { $scope.portfolios = response.data; }, errorHandler);
        }

        function errorHandler(data) {
            console.log('Shit didn\'t work. ' + data);
        }

        function getUserDetails(username) {
            var deferred = $q.defer();
            $http.get('/user/' + username).then(deferred.resolve, deferred.reject);
            return deferred.promise;
        }

        function getUserPortfolios(username) {
            var deferred = $q.defer();
            $http.get('/user/' + username + '/portfolio').then(deferred.resolve, deferred.reject);
            return deferred.promise;
        }

        initialize();
    }
]);
