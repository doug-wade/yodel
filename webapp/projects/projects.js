function ProjectsCtrl($scope, $http, $stateParams, $q) {
  function initialize() {
    console.log('Initializing ProjectCtrl...');
    this.http = $http;
    this.scope = $scope;
    this.username = $stateParams.username;
    this.q = $q;
    console.log('Got username ' + this.username);

    getProjects(this.username).then(function(response) {
      console.log("Got projects for: " + this.username);
      console.table(response.data);

      this.scope.projects = response.data;
    });
  }

  function getProjects(username) {
    var deferred = this.q.defer();

    this.http.get('/user/' + username + '/projects').then(deferred.resolve, deferred.reject);

    return deferred.promise;
  }

  function errorHandler(err) {
    console.error(err);
  }

  initialize();
};

angular.module('projects', []).controller('ProjectsCtrl', ['$scope', '$http', '$stateParams', '$q', ProjectsCtrl]);
