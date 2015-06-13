angular.module('event-carousel', [
]).directive('carousel', [
    function() {
        function link() {
        }

        return {
            restrict: 'E',
            templateUrl: 'event-carousel.html',
            transclude: true,
            link: link
        };
    }
]);
