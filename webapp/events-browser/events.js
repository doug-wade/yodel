angular.module('events', [
]).controller('EventsCtrl', [
    '$scope',
    '$ionicSideMenuDelegate',
    function($scope, $ionicSideMenuDelegate) {
        $scope.text = 'Some initial value';
        $scope.myActiveSlide = 1;
        $scope.toggleLeft = function() {
          $ionicSideMenuDelegate.toggleLeft();
        };
    }
]);
