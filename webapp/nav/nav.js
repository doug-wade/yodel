angular.module('nav', [
]).controller('NavCtrl', [
    '$scope',
    '$location',
    function($scope, $location) {
        $scope.selected = $location.path();
    }
]);