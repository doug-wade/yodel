angular.module('signup', [
]).controller('SignupCtrl', [
    '$http',
    '$location',
    '$scope',
    function($http, $location, $scope) {
        function initialize() {
            $scope.signUp = signUp;
            $scope.showValidation = false;
            $scope.signupParams = {};
        }

        function signUp(form, inputs) {
            if (form && form.$valid) {
                initialize();
                $http.post('/signup', inputs).then(
                    function() {
                        $location.url('/profile');
                    },
                    function(data) {
                        console.log('Unable to sign up.', data);
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