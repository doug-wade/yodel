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

  var questions = [
    { text: '', answer: '' },
    { text: 'Why would I use Yodel?', answer: "Yodel makes it EASY! Whether you're finding cheap tickets, connecting with collaborators, or packing your venues, Yodel is the app to use. We de-stress the creative process, and make finding & hosting entertainment as simple as a few well placed finger taps. Really, why not use Yodel?" },
    { text: "Isn't there already an app for that?", answer: "Not quite...our competitors certainly try but...our tripartite system is unparalleled in its function & potential. It's an innovative, self-sustaining circuit of interaction, deeply rooted in creative connection & cultivating community. We are revolutionizing the logistics of artistic interaction." },
    { text: 'Why does Yodel exist?', answer: "A lack of awareness, coupled with stiff ticket prices and lengthy travel times are just a few catalysts causing the national decline in art and cultural event attendance. Yodel's Comprehensive Artistic Network makes events accessible for Patrons, profitable for Organizations, and fulfilling for Creatives." },
    { text: 'How do I use Yodel?', answer: 'Simple! Just create a profile and plug into our network. We offer three different profile options suited for your specific needs. Creatives can create an established online presence enabling fluid collaboration, project acquisition, and professional exposure . Patrons can find events tailored to their interests, support ongoing work, connect with other users, and create a following. Organizations can subscribe for customer data & analytics, find the right artists for their venues, and fortify their reputation. Just swipe and type!' },
    { text: 'Will my device support Yodel?', answer: 'Yes! Yodel is a multi platform application that can be used on any device with internet connection & browsing capability. This includes but is not limited to Android, IOS, Windows and other mobile devices.' },
    { text: 'Can I register?', answer: "Maybe! We've launched a limited private beta. Fill out the form below to request a beta key." }
  ];

  function getTeamPhotoRows(windowWidth) {
    // var numPerRow = Math.floor(windowWidth / 300) || 1;
    var numPerRow = 2;
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

  function getQuestionColumns(width) {
    $log.info('Got window width', width);
    $log.info(width < 600 ? 'FAQ is in 1 column' : 'FAQ is in 2 columns');
    if (width < 600) {
      return [questions];
    } else {
      return [questions.slice(0, Math.ceil(questions.length / 2)), questions.slice(Math.ceil(questions.length / 2))];
    }
  }

  $scope.rows = getTeamPhotoRows($window.innerWidth);
  $scope.questionColumns = getQuestionColumns($window.innerWidth);
  // $scope.heroWidth = $window.innerWidth;
  // $scope.heroHeight = ((682 / 975) * $window.innerWidth);
  // $window.addEventListener('resize', function() {
    // $scope.rows = getTeamPhotoRows($window.innerWidth );
    // $scope.questionColumns = getQuestionColumns(1);
  // });
}

angular.module('about', []).controller('AboutCtrl', ['$scope', '$window', '$log', AboutCtrl]);
