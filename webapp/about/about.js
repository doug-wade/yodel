function AboutCtrl($scope, $window) {
  var advisoryBoardPhotos = [
    {
      memberName: 'Jackie Short',
      memberTitle: 'Marketing Advisor',
      photoUrl: 'https://s3-us-west-2.amazonaws.com/yodel.is/images/Advisory+board+portraits/Jackie+Short+Blue+Heron.jpg'
    },
    {
      memberName: 'Erika Smith',
      memberTitle: 'Business & Entrepenurial Ventures',
      photoUrl: 'https://s3-us-west-2.amazonaws.com/yodel.is/images/Advisory+board+portraits/Erika+Smith+White+Owl.jpg'
    },
    {
      memberName: 'Liisa Spink',
      memberTitle: 'Art & Business Management',
      photoUrl: 'https://s3-us-west-2.amazonaws.com/yodel.is/images/Advisory+board+portraits/Liisa+Spink+Screech+Owl.jpg'
    },
    // {
    //   memberName: 'Susie Lee',
    //   memberTitle: 'Startup Wunderkind',
    //   photoUrl: 'https://s3-us-west-2.amazonaws.com/yodel.is/images/'
    // },
    {
      memberName: 'Katjana Vadeboncoeur',
      memberTitle: 'Arts & Business Proceedings',
      photoUrl: 'https://s3-us-west-2.amazonaws.com/yodel.is/images/Advisory+board+portraits/Katjana+Vadeboncoeur+Red+Panda.jpg'
    }
  ];

  var teamPhotos = [
    {
      memberName: 'MICHAEL',
      memberTitle: 'Chief Executive Officer',
      photoUrl: 'https://s3-us-west-2.amazonaws.com/yodel.is/images/michael-dreger-business-cat.png'
    },
    {
      memberName: 'SPENCER',
      memberTitle: 'Vice President',
      photoUrl: 'https://s3-us-west-2.amazonaws.com/yodel.is/images/spencer-funk-business-chicken.png'
    },
    {
      memberName: 'JOSHUA',
      memberTitle: 'Chief Creative Officer',
      photoUrl: 'https://s3-us-west-2.amazonaws.com/yodel.is/images/joshua-taylor-tuxedo-cat.png'
    },
    {
      memberName: 'DOUG',
      memberTitle: 'Chief Technical Officer',
      photoUrl: 'https://s3-us-west-2.amazonaws.com/yodel.is/images/doug-wade-lizard-flipped.png'
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

  function getPhotoRows(photos) {
    var numPerRow = 2;
    var rows = [];
    var row = [];

    for (var i = 0; i < photos.length; i++) {
      row.push(photos[i]);
      if (row.length === numPerRow) {
        rows.push(row);
        row = [];
      }
    }
    rows.push(row);
    return rows;
  }

  function getQuestionColumns(width) {
    if (width < 600) {
      return [questions];
    } else {
      return [questions.slice(0, Math.ceil(questions.length / 2)), questions.slice(Math.ceil(questions.length / 2))];
    }
  }

  $scope.teamPhotoRows = getPhotoRows(teamPhotos);
  $scope.advisoryBoardRows = getPhotoRows(advisoryBoardPhotos);
  $scope.questionColumns = getQuestionColumns($window.innerWidth);
}

angular.module('about', []).controller('AboutCtrl', ['$scope', '$window', '$log', AboutCtrl]);
