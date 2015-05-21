angular.module('nav', [
    'ui.router'
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
        }
    }
]);