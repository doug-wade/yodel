function NavCtrl($rootScope, $scope, $ionicSideMenuDelegate) {
    // TODO this is a hack; can we use a directive so that we don't need to watch the rootScope?
    $rootScope.$watch('username', function(value) {
        $scope = $rootScope;
        $scope.username = value;
    });

    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
}

angular.module('nav').controller('NavCtrl', [ '$rootScope', '$scope', '$ionicSideMenuDelegate',
  NavCtrl]);
