function FluidImage($window, $log) {
  return {
    templateUrl: '/partials/about/fluid-image.html',
    transclude: true,
    scope: {
      src: '@'
    }
  };
}

angular.module('about').directive('fluidImage', [ '$window', '$log', FluidImage]);
