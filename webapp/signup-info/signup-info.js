function SignupInfoCtrl($http, $scope, $state, $window, $rootScope, $log, $q) {
  function postDisciplines() {
    var checkedDisciplines, customDeferred, customRequest, newDiscipline, userDeferred, userRequest;
    if ($scope.step === 1) {
      $scope.step = 2;
      // doug.wade 2015/08/25 TODO: This is super bizarre.
      return $q.defer().reject('Changing step...');
    }

    customDeferred = $q.defer();
    userDeferred = $q.defer();
    userRequest = { disciplines: [] };
    checkedDisciplines = [];
    $scope.disciplines.forEach(function(discipline) {
      if (discipline.checked) {
        checkedDisciplines.push(discipline);
      }
    });
    userRequest.disciplines = userRequest.disciplines.concat(checkedDisciplines);

    if ($scope.customDiscipline.text) {
      newDiscipline = $scope.customDiscipline;
      newDiscipline.checked = false;
      userRequest.disciplines.push(newDiscipline);
      $log.info('Sending disciplines: ', userRequest);

      customRequest = { disciplines: [ newDiscipline ] };
      $http.post('/discipline', customRequest)
        .then(function(response) {
          customDeferred.resolve(response);
        }, function (error) {
          customDeferred.reject(error);
        }
      );
    }

    $http.post('/user/' + $rootScope.username + '/disciplines', userRequest)
      .then(function(response) {
        userDeferred.resolve(response);
      }, function(error) {
        userDeferred.resolve(error);
      });

    return $q.all(customDeferred.promise, userDeferred.promise).then(function(response) {
      $log.info(response);
      $state.go('yodel.profile');
    }).promise;
  }

  function getDisciplines(){
    $log.info('Getting disciplines');

    $http.get('/discipline')
      .then(function(success){
        $log.info(success);
        $scope.disciplines = success.data;
      }, function(error){
        $log.error(error);
      });
  }

  function initialize(){
      $scope.postDisciplines = postDisciplines;
      $scope.currentStep = 'disciplines';
      $scope.step = 1;
      $scope.customDiscipline = {};
      getDisciplines();
  }

  initialize();
}

angular.module('signup-info', [
]).controller('SignupInfoCtrl', [
  '$http',
  '$scope',
  '$state',
  '$window',
  '$rootScope',
  '$log',
  '$q',
  SignupInfoCtrl
]);
