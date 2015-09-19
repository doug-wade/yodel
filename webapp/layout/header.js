function Header() {
  return {
    restrict: 'E',
    templateUrl: '/partials/layout/header.html',
    controller: function($scope) {
      function randomChoice(arr) {
        return arr[Math.floor(arr.length * Math.random())];
      }
      $scope.color = 'background-' + randomChoice(['yodel-blue', 'yodel-teal', 'yodel-pink',
        'yodel-purple', 'yodel-canary', 'yodel-orange-red', 'yodel-yellow']);
    }
  };
}

angular.module('layout').directive('yodelHeader', [ Header ]);
