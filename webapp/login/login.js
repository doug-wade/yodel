angular.module('login', [
]).controller('LoginCtrl', [
    '$http',
    '$location',
    '$rootScope',
    '$scope',
    '$window',
    function($http, $location, $rootScope, $scope, $window) {
        function initialize() {
            $scope.login = login;
            $scope.showValidation = false;
            $scope.loginParams = {};
        }

        function login(form, inputs) {
            if (form && form.$valid) {
                initialize();
                $http.post('/login', inputs).then(
                    function(response) {
                        $window.sessionStorage.token = response.data.token;
                        $rootScope.username = response.data.username;
                        $location.url('/profile/' + response.data.username);
                    },
                    function(data) {
                        delete $window.sessionStorage.token;
                        $scope.showValidation = true;
                    });
            } else if (form && form.$invalid) {
                $scope.showValidation = true;
            }
        }

        initialize();
    }
]);
