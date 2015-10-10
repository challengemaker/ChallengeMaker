
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

    .when('/newchallenge', {
      templateUrl: 'templates/_new_challenge.html',
      controller: 'challengesCtrl',
      controllerAs: 'challenges'
    })


    .when('/youvebeenchallenged', {
      templateUrl: 'templates/_challenge_received.html',
      controller: 'challengesCtrl',
      controllerAs: 'challenges'
    })

    .when('/acceptchallenge', {
      templateUrl: 'templates/_accept_challenge.html',
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

    .when('/signup', {
      templateUrl: 'templates/_signup.html',
      controller: 'userCtrl',
      controllerAs: 'user'
    })

    .when('/newprofile', {
      templateUrl: 'templates/_newprofile.html',
      controller: 'userCtrl',
      controllerAs: 'user'
    })

    .when('/terms', {
      templateUrl: 'templates/_terms_of_service.html'
    })

    .when('/charities/:name', {
      templateUrl: 'templates/_singlecharity.html',
      controller: 'charityCtrl',
      controllerAs: 'charity'
    })

    .when('/charities', {
      templateUrl: 'templates/_charities.html',
      controller: 'charityCtrl',
      controllerAs: 'charity'
    })

    .when('/contact', {
      templateUrl: 'templates/_contact.html'
    })

    .when('/settleup', {
      templateUrl: 'templates/_settleup.html'
    })

    .when('/about', {
      templateUrl: 'templates/_about.html'
    })

    .when('/cms', {
      templateUrl: 'templates/_cms.html'
    })

    .otherwise('/');
}
