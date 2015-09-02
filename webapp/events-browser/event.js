function Event() {
  return {
    restrict: 'A',
    templateUrl: '/partials/events-browser/event.html',
    scope: {
      eventInfo: '=info'
    }
  };
}

angular.module('events', []).directive('event', Event);
