angular.module('portfolio', [
]).controller('PortfolioCtrl', [
    '$http',
    '$q',
    '$scope',
    '$stateParams',
    function($http, $q, $scope, $stateParams) {
        function initialize() {
            $scope.portfolioItems = [];
            $scope.portfolio = $stateParams.portfolio;

            getPortfolioItems($stateParams.username, $stateParams.portfolio).then(function(response) { $scope.portfolioItems = response.data}, errorHandler);
        }

        function errorHandler() { }

        function getPortfolioItems(username, portfolio) {
            var deferred = $q.defer();
            $http.get('/user/' + username + '/portfolio/' + portfolio).then(deferred.resolve, deferred.reject);
            return deferred.promise;
        }

        initialize();
    }
]);