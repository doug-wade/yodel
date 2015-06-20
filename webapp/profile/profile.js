angular.module('profile', [
]).controller('ProfileCtrl', [
    '$http',
    '$q',
    '$scope',
    '$stateParams',
    function($http, $q, $scope, $stateParams) {
        function initialize() {
            $scope.user = {};
            $scope.portfolios = [];
            $scope.username = $stateParams.username;

            getUserDetails($stateParams.username).then(
                function(response) {
                    $scope.user = response.data;
                },
                errorHandler);

            getUserPortfolios($stateParams.username).then(
                function(response) {
                    $scope.portfolios = response.data;
                },
                errorHandler);
        }

        function errorHandler(data) { }

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
