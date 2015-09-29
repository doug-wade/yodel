function FluidImage($window, $log) {
  return {
    templateUrl: '/partials/about/fluid-image.html',
    transclude: true,
    scope: {
      src: '@'
    },
    controller: ['$scope', ($scope) => {
      $log.info($scope.src);
      var updateStyles = () => {
        $scope.imageWidth = $window.innerWidth;
        $scope.imageHeight = ((463 / 960) * $window.innerWidth);
        $log.info('resizing image to ' + $scope.imageWidth + ' x ' + $scope.imageHeight);
      };
      updateStyles();
      $scope.$watch(() => $window.innerWidth, updateStyles);
    }]
  };
}

angular.module('about').directive('fluidImage', [ '$window', '$log', FluidImage]);
