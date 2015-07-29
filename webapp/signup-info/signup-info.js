angular.module('signup-info', [
]).controller('SignupInfoCtrl', [
    '$http',
    '$scope',
    '$state',
    '$window',
    '$rootScope',
    function($http, $scope, $state, $window, $rootScope) {
        
        function initialize(){
            $scope.postDisciplines = postDisciplines;
            $scope.currentStep = "disciplines";
            $scope.alert = console.log('foobar');
            $scope.step = 1;
            getDisciplines();
        };
        
        function postDisciplines(){
            if($scope.step === 1){
                //TODO: Check to make sure that at least 1 disipline is selected
                $scope.step = 2;
            }else{
                $http.post('/user/' + $rootScope.username + "/disciplines", $scope.disciplines).then(
                    function(response) {
                        /* Success */
                        $state.go('yodel.profile');
                    },
                    function(data) {
                        /* Error */
                    });
            }
        };
        
        function getDisciplines(){
            console.log("Getting disciplines");
            $http.get('/user/' + $rootScope.username + "/disciplines").then(
                function(success){
                    /* Sucess */
                    $scope.disciplines = success.data;
                    console.log(success);
                    console.log($scope.disciplines);
                },
                function(error){
                    /* Error */
                },
                function(notify){
                    /* Notification */
                });
        };
        
        initialize();
    }
]);