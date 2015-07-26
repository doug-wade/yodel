function ProjectsCtrl($scope, $http, $stateParams, $q, $log) {
  function initialize() {
    var username;

    username = $stateParams.username;

    $scope.isEditing = false;
    $scope.saveProject = saveProject;
    $scope.showEditingForm = showEditingForm;
    $scope.newProject = {};

    getProjects(username).then(function(response) {
      $scope.projects = response.data;
      $log.info("Loaded " + $scope.projects.length + " projects.");
    });
  }

  function getProjects(username) {
    var deferred;

    deferred = $q.defer();
    $http.get('/user/' + username + '/projects').then(deferred.resolve, deferred.reject);

    return deferred.promise;
  }

  function addNewProject(project) {
    var deferred, username;

    deferred = $q.defer();
    username = $stateParams.username;

    $http.post('/user/' + username + '/projects').then(deferred.resolve, deferred.reject);

    return deferred.promise;
  }

  function errorHandler(err) {
    $log.error(err);
  }

  function saveProject() {
    var toPost;
    
    $log.info("saving project...");

    toPost = $scope.newProject;
    $scope.newProject = {};

    addNewProject(toPost).then(function(response) {
      var oldLen;

      oldLen = $scope.projects.length;
      $scope.projects = response.data;
      $log.info("Had " + oldLen + " projects previously; added one, then loaded " + $scope.projects.length + " projects.")
    });

    $scope.isEditing = false;
  }

  function showEditingForm() {
    $log.info("showing editing form...");
    $scope.isEditing = true;
  }

  initialize();
};

angular.module('projects', []).controller('ProjectsCtrl', ['$scope', '$http', '$stateParams', '$q', '$log', ProjectsCtrl]);
