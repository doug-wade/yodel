function AboutCtrl($scope, $window, $log) {
  var teamPhotos = [
    {
      teamMemberName: 'MICHAEL',
      teamMemberTitle: 'Chief Executive Officer',
      photoUrl: '/images/michael-dreger-business-cat.png'
    },
    {
      teamMemberName: 'SPENCER',
      teamMemberTitle: 'Vice President',
      photoUrl: '/images/spencer-funk-business-chicken.png'
    },
    {
      teamMemberName: 'JOSHUA',
      teamMemberTitle: 'Chief Creative Officer',
      photoUrl: '/images/joshua-taylor-tuxedo-cat.png'
    },
    {
      teamMemberName: 'DOUG',
      teamMemberTitle: 'Chief Technical Officer',
      photoUrl: '/images/doug-wade-lizard-flipped.png'
    }
  ];
  function getRows(windowWidth) {
    var numPerRow = Math.floor(windowWidth / 300) || 1;
    var rows = [];
    var row = [];
    for (var i = 0; i < teamPhotos.length; i++) {
      row.push(teamPhotos[i]);
      if (row.length === numPerRow) {
        rows.push(row);
        row = [];
      }
    }
    rows.push(row);
    $log.info('team photos should be in a ' + numPerRow + ' x ' + rows.length + ' grid.');
    return rows;
  }
  $scope.rows = getRows($window.innerWidth);
  $scope.heroWidth = $window.innerWidth - (.1 * $window.innerWidth);
  $scope.heroHeight = ((682 / 975) * $window.innerWidth);
  $window.addEventListener('resize', function() {
    $scope.rows = getRows($window.innerWidth);
  });
}

angular.module('about', []).controller('AboutCtrl', ['$scope', '$window', '$log', AboutCtrl]);
