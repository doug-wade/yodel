function Footer() {
  return {
    restrict: 'E',
    templateUrl: '/partials/layout/footer.html',
    controller: function($scope) {
      $scope.year = new Date().getFullYear();
    }
  };
}

angular.module('layout', []).directive('yodelFooter', [ Footer ]);
