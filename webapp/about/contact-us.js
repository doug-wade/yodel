function ContactUs($log, $http) {
  return {
    restrict: 'E',
    templateUrl: '/partials/about/contact-us.html',
    controller: ['$scope', function($scope) {
      $scope.types = [
        {
          name: 'Creative',
          value: 'creative'
        }, {
          name: 'Organization',
          value: 'organization'
        }, {
          name: 'Patron',
          value: 'patron'
        }
      ];

      $scope.submit = function() {
        $scope.submitted = true;
        var contactForm = {
          name: $scope.name,
          type: $scope.type,
          email: $scope.email,
          desc: $scope.desc
        };

        $log.info('Posting contact-us form: ', contactForm);

        $http.post('/contact-us', contactForm).then(function(payload, err) {
          if (err) {
            $log.error(err);
          }
        });
      };
    }]
  };
}

angular.module('about').directive('contactUs', ['$log', '$http', ContactUs]);
