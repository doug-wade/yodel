function SignupCtrl($http, $scope, $state, $window, $rootScope, $log) {
    function signUp(form, inputs) {
        if (form && form.$valid) {
            initialize();
            $log.info(inputs);
            $http.post('/signup', inputs).then(
                function(response) {
                    $window.sessionStorage.token = response.data.token;
                    $window.sessionStorage.username = response.data.username;
                    $rootScope.username = response.data.username;
                    //$state.go('profile', { username: response.data.username });
                    $state.go('signup-info');
                },
                function(data) {
                    delete $window.sessionStorage.token;
                    $scope.showValidation = true;
                    $log.info('logged in ', data);
                });
        } else if (form && form.$invalid) {
            $scope.showValidation = true;
        }
    }

    function initialize() {
        $scope.signUp = signUp;
        $scope.showValidation = false;
        $scope.signupParams = {};
    }

    initialize();
}

angular.module('signup').controller('SignupCtrl', [ '$http', '$scope', '$state', '$window', '$rootScope', '$log',
  SignupCtrl]);
