var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec' ];

function formatDate(toFormat) {
  return toFormat.getDate() + ' ' + months[toFormat.getMonth()];
}

function EventsCtrl($scope, $ionicSideMenuDelegate) {
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
}

angular.module('events').controller('EventsCtrl', ['$scope', '$ionicSideMenuDelegate', EventsCtrl]);
