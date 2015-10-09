
angular.module('app.routes', ['ngRoute'])

  .config(appRoutes);

appRoutes.$inject = ['$routeProvider'];

function appRoutes($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'templates/_home.html',
      controller: 'mainCtrl',
      controllerAs: 'main'
    })
}
