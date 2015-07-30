angular.module('about', [
]).controller('AboutCtrl', [
    '$scope',
    function($scope) {
        $scope.year = new Date().getFullYear();
    }
]);
