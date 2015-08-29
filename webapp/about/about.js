function AboutCtrl($scope) {
    $scope.year = new Date().getFullYear();
}

angular.module('about', []).controller('AboutCtrl', ['$scope', AboutCtrl]);
