angular.module('login', [
]).controller('LoginCtrl', [
    '$http',
    '$location',
    '$scope',
    function($http, $location, $scope) {
        function initialize() {
            $scope.login = login;
            $scope.showValidation = false;
            $scope.loginParams = {};
        }

        function login(form, inputs) {
            if (form && form.$valid) {
                initialize();
                $http.post('/login', inputs).then(
                    function() {
                        $location.url('/profile');
                    },
                    function(data) {
                        console.log('Unable to sign in.', data);
                    });
            } else if (form && form.$invalid) {
                $scope.showValidation = true;
            }
        }

        initialize();
    }
]);
