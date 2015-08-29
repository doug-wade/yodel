angular.module('create-portfolio', [
]).controller('CreatePortfolioCtrl', [
    '$http',
    '$scope',
    '$state',
    '$stateParams',
    '$log',
    function($http, $scope, $state, $stateParams, $log) {
        function createPortfolio(form, params, file, username) {
            if (form && form.$valid) {
                var options = {
                    headers: { 'Content-Type': undefined },
                    transformRequest: function(data) {
                        var formData = new FormData();
                        formData.append('createParams', angular.toJson(data.createParams));
                        if (data.file) {
                            formData.append('file', data.file);
                        }
                        return formData;
                    }
                };

                $http.post('/user/' + username + '/portfolio', { createParams: params, file: file }, options).then(
                    function(response) {
                        $state.go('yodel.profile', { username: username });
                        $log('posted portfolio', response);
                    },
                    function(response) {
                        console.log(response);
                        $scope.showValidation = true;
                    });
            } else {
                $scope.showValidation = true;
            }
        }

        function fileNameChanged(element) {
            $scope.file = element.files[0];
            $scope.$apply();
        }

        // TODO there is a bug in the validation display that continues to show validation error containers (not the message) after the problems have been fixed
        function initialize() {
            $scope.showValidation = false;
            $scope.username = $stateParams.username;
            $scope.create = createPortfolio;
            $scope.fileNameChanged = fileNameChanged;
            $scope.file = null;
            $scope.createParams = {
                date: new Date()
            };
        }

        initialize();
    }
]);
