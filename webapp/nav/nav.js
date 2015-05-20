angular.module('nav', [
]).directive('HighlightTab', [
    '$location',
    function($location) {
        return {
            restrict: 'C',
            link: function($scope, $element, $attributes) {
                var elementPath = $element.find('a').attr('href').substring(1);
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