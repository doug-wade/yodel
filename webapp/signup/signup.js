angular.module('signup', [
]).controller('SignupCtrl', [
    '$http',
    '$scope',
    '$state',
    '$window',
    '$rootScope',
    function($http, $scope, $state, $window, $rootScope) {
        function initialize() {
            $scope.signUp = signUp;
            $scope.showValidation = false;
            $scope.signupParams = {};
        }

        function signUp(form, inputs) {
            if (form && form.$valid) {
                initialize();
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
                    });
            } else if (form && form.$invalid) {
                $scope.showValidation = true;
            }
        }

        initialize();
    }
]).directive('compareTo', function() {
    return {
        require: 'ngModel',
        scope: {
            otherModelValue: '=compareTo'
        },
        link: function(scope, element, attributes, ngModel) {
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue === scope.otherModelValue.$viewValue;
            };

            scope.$watch('otherModelValue', function() {
                ngModel.$validate();
            });
        }
    };
});
