var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec' ];

function formatDate(toFormat) {
  return toFormat.getDate() + ' ' + months[toFormat.getMonth()];
}

function EventsCtrl($scope, $ionicSideMenuDelegate, $log) {
    $scope.text = 'Some initial value';
    $scope.myActiveSlide = 1;
    $scope.toggleLeft = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.formatDate = formatDate;
    $scope.events = [
      {
        'name': "Ma Rainey's Black Bottom",
        'description': 'The third play in the Pittsburgh Cycle',
        'img': '/images/MaRainey.jpg',
        'startDate': new Date('2015-08-25'),
        'endDate': new Date('2015-09-21'),
        'location': {
          'name': 'Cornish Playhouse at Seattle Center',
          'lat': 47,
          'lon': -122
        }
      },
      {
        'name': "Joe Turner's Come and Gone",
        'description': 'The second play in the Pittsburgh Cycle',
        'img': '/images/joe_turner.jpg',
        'startDate': new Date('2015-09-01'),
        'endDate': new Date('2015-10-21'),
        'location': {
          'name': 'Broadway West Theatre Co',
          'lat': 47,
          'lon': -122
        }
      }
    ];
    $scope.events = $scope.events.map(function(event) {
      event.formattedStartDate = formatDate(event.startDate);
      event.formattedEndDate = formatDate(event.endDate);
      return event;
    });
    $scope.eventIndex = 0;
    $scope.event = $scope.events[0];
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

angular.module('events').controller('EventsCtrl', ['$scope', '$ionicSideMenuDelegate', '$log', EventsCtrl]);
