function ProjectsCtrl($scope, $http, $stateParams, $q, $log) {
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
    // Strip the token-input specific data structure
    project.collaborators = project.collaborators.map((elem) => elem.text);

    $http.post('/user/' + username + '/projects', project).then(deferred.resolve, deferred.reject);

    return deferred.promise;
  }

  function saveProject() {
    var toPost;

    $log.info('saving project...');

    toPost = $scope.newProject;
    $scope.newProject = {};

    addNewProject(toPost).then(function(response) {
      var project = response.data;
      $log.info('Successfully created project ' + JSON.stringify(project));
      $scope.projects.push(project);
    });

    $scope.isEditing = false;
  }

  function getUsers() {
    $http.get('/user').then(function (response) {
      $log.info('Got users: ', response);
      $scope.possibleCollaborators = response.data.map((datum) => datum.username);
    });
  }

  function showEditingForm() {
    $scope.isEditing = true;
  }

  function initialize() {
    var username;

    username = $stateParams.username;

    $scope.isEditing = false;
    $scope.saveProject = saveProject;
    $scope.showEditingForm = showEditingForm;
    $scope.getCollaborators = (query) => {
      return $scope.possibleCollaborators.filter((collab) => { return collab.indexOf(query) >= 0; });
    };
    $scope.newProject = {};

    getProjects(username).then(function(response) {
      $scope.projects = response.data;
      $log.info('Loaded ' + $scope.projects.length + ' projects.');
    });

    getUsers();
  }

  initialize();
}

angular.module('projects', []).controller('ProjectsCtrl', ['$scope', '$http', '$stateParams', '$q', '$log', ProjectsCtrl]);
