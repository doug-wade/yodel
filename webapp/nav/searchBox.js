function SearchBox($http, $state, $log) {
  return {
    restrict: 'E',
    templateUrl: '/partials/nav/search-box.html',
    controller: ['$scope', ($scope) => {
      $log.info('Search box scope', $scope);
      $scope.result = {};
      $scope.query = '';

      $scope.refreshResults = (searchTerm) => {
        if (!searchTerm) {
          $scope.results = [];
          return;
        }
        $http.get('/search/' + searchTerm).then((payload) => {
          $scope.results = payload.data.results;
        });
      };

      $scope.chooseQueryOption = (item, model) => {
        $log.info('chose query item', item);
        if (item.type === 'user') {
          $state.go('yodel.profile', {username: item.label });
        } else if (item.type === 'project') {
          $state.go('yodel.project', item.label);
        } else {
          $log.info('chose query model', model);
          $log.error('chose unsupported query result type: ' + item.type);
        }
      };
    }]
  };
}

angular.module('nav').directive('searchBox', ['$http', '$state', '$log', SearchBox]);
