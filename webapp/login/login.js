angular.module('login', [
]).controller('LoginCtrl', [
    '$http',
    '$rootScope',
    '$scope',
    '$state',
    '$window',
    function($http, $rootScope, $scope, $state, $window) {
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
                        $window.sessionStorage.username = response.data.username;
                        $rootScope.username = response.data.username;
                        $state.go('yodel.profile', { username: response.data.username });
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
