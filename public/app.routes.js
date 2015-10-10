
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

    .when('/challenges', {
      templateUrl: 'templates/_challenges.html',
      controller: 'challengesCtrl',
      controllerAs: 'challenges'
    })

    .when('/challenges/:id', {
      templateUrl: 'templates/_singleChallenge.html',
      controller: 'challengesCtrl',
      controllerAs: 'challenges'
    })

    .when('/users', {
      templateUrl: 'templates/_users.html',
      controller: 'userCtrl',
      controllerAs: 'user'
    })

    .when('/users/:id', {
      templateUrl: 'templates/_singleUser.html',
      controller: 'userCtrl',
      controllerAs: 'user'
    })

    .when('/charities', {
      templateUrl: 'templates/_charities.html',
      controller: 'charityCtrl',
      controllerAs: 'charity'
    })

    .otherwise('/');
}
