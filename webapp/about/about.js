angular.module('about', [
]).controller('AboutCtrl', [
    '$scope',
    function($scope) {
        $scope.aboutYodel = 'Here is a blurb about Yodel';
    }
]);