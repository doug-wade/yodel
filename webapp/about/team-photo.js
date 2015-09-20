function TeamPhoto() {
  return {
    restrict: 'E',
    templateUrl: '/partials/about/team-photo.html',
    scope: {
      photoUrl: '=photoUrl',
      teamMemberTitle: '=teamMemberTitle',
      teamMemberName: '=teamMemberName'
    }
  };
}

angular.module('about').directive('teamPhoto', [ TeamPhoto ]);
