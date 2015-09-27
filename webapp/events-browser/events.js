var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec' ];

function formatDate(toFormat) {
  return toFormat.getDate() + ' ' + months[toFormat.getMonth()];
}

function EventsCtrl($scope, $ionicSideMenuDelegate, $http, $log) {
  $scope.text = 'Some initial value';
  $scope.myActiveSlide = 1;
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.formatDate = formatDate;
  $http.get('/events').then((data) => {
    $log.info(data.data);
    $scope.events = data.data.map(function(event) {
      event.formattedStartDate = formatDate(new Date(event.startDate));
      event.formattedEndDate = formatDate(new Date(event.endDate));
      return event;
    });
    $scope.event = $scope.events[0];
  });
  $scope.eventIndex = 0;
  $scope.nextEvent = function() {
    $log.info('Called next event.');
    if ($scope.eventIndex === $scope.events.length - 1) {
      $scope.eventIndex = 0;
    } else {
      $scope.eventIndex += 1;
    }
    $scope.event = $scope.events[$scope.eventIndex];
  };
  $scope.prevEvent = function() {
    $log.info('Called prev event.');
    if ($scope.eventIndex === 0) {
      $scope.eventIndex = ($scope.events.length - 1);
    } else {
      $scope.eventIndex -= 1;
    }
    $scope.event = $scope.events[$scope.eventIndex];
  };
}

angular.module('events').controller('EventsCtrl', ['$scope', '$ionicSideMenuDelegate', '$http', '$log', EventsCtrl]);
