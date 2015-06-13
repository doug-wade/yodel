angular.module('login', [
]).controller('LoginCtrl', [
    '$http',
    '$location',
    '$scope',
    function($http, $location, $scope) {
        function initialize() {
            $scope.login = login;
        }

        function login(form, inputs) {
            if (form && form.$valid) {
                $http.post('/login', inputs).then(
                    function() {
                        $location.url('/profile');
                    },
                    function(data) {
                        console.log('Unable to sign in.', data);
                    });
            }
        }

        initialize();
    }
]);
