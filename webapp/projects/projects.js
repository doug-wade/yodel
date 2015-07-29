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
    // Doug 2015/7/28 I added this as a shitty hack since we have a demo on 7/30/2015.  Once we
    // have a token input form, we should send these as a list of strings and persist that directly.
    project.collaborators = project.collaborators.split(",");

    $http.post('/user/' + username + '/projects', project).then(deferred.resolve, deferred.reject);

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
      var project = response.data;
      $log.info("Successfully created project " + JSON.stringify(project));
      $scope.projects.push(project);
    });

    $scope.isEditing = false;
  }

  function showEditingForm() {
    $scope.isEditing = true;
  }

  initialize();
};

angular.module('projects', []).controller('ProjectsCtrl', ['$scope', '$http', '$stateParams', '$q', '$log', ProjectsCtrl]);
