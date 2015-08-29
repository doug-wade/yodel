angular.module('nav', [
    'ui.router'
]).controller('NavCtrl', [
    '$rootScope',
    '$scope',
    '$ionicSideMenuDelegate',
    function($rootScope, $scope, $ionicSideMenuDelegate) {
        // TODO this is a hack; can we use a directive so that we don't need to watch the rootScope?
        $rootScope.$watch('username', function(value) {
            $scope = $rootScope;
            $scope.username = value;
        });

        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };
    }
]).directive('HighlightTab', [
    '$location',
    function($location) {
        return {
            restrict: 'C',
            link: function($scope, $element, $attributes) {
                var elementPath = $attributes.href.substring(1);
                $scope.$location = $location;

                $scope.$watch('$location.path()', function(locationPath) {
                    if (elementPath === locationPath) {
                        $element.addClass('active');
                    } else {
                        $element.removeClass('active');
                    }
                });
            }
        };
    }
]);
