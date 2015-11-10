
angular.module('app.routes', ['ngRoute'])

  .config(appRoutes);

appRoutes.$inject = ['$routeProvider'];

function appRoutes($routeProvider){
  $routeProvider

    .when('/challenges', {
      templateUrl: 'templates/_home.html'
      ,controller: 'challengesCtrl'
      ,controllerAs: 'challenges'
    })

    .when('/challenges/:name', {
      templateUrl: 'templates/_singleChallenge.html'
      ,controller: 'challengesCtrl'
      ,controllerAs: 'challenges'
    })

    .when('/newchallenge', {
      templateUrl: 'templates/_new_challenge.html'
      ,controller: 'challengesCtrl'
      ,controllerAs: 'challenges'
    })

    .when('/payments/:challenge_name', {
      templateUrl: 'templates/_payments.html'
      ,controller: 'paymentsCtrl'
      ,controllerAs: 'payment'
    })

    .when('/donationreceived/', {
      templateUrl: 'templates/_donation_received.html'
      ,controller: 'paymentsCtrl'
      ,controllerAs: 'payment'
    })

    .when('/donate/:challenge_name', {
      templateUrl: 'templates/_new_donation.html'
      ,controller: 'donationCtrl'
      ,controllerAs: 'donation'
    })

    .when('/donate/challengefriends/:name', {
      templateUrl: 'templates/_challengefriends.html'
      ,controller: 'donationCtrl'
      ,controllerAs: 'donation'
    })

    .when('/checkout', {
      templateUrl: 'templates/_checkout.html'
      ,controller: 'paymentsCtrl'
      ,controllerAs: 'payment'
    })

    .when('/test', {
      templateUrl: "templates/_testStuff.html"
      ,controller: 'challengesCtrl'
      ,controllerAs: "challenges"
    })

    .when('/signin/:name', {
      templateUrl: 'templates/_signin_challenge.html'
      ,controller: 'userCtrl'
      ,controllerAs: 'user'
    })

    .when('/signin', {
      templateUrl: 'templates/_signin.html'
      ,controller: 'userCtrl'
      ,controllerAs: 'user'
    })

    .when('/youvebeenchallenged/:challengename/:videoid/:name', {
      templateUrl: 'templates/_challenge_received.html'
      ,controller: 'challengesCtrl'
      ,controllerAs: 'challenges'
    })

    .when('/youvebeenchallenged/:name', {
      templateUrl: 'templates/_challenge_received.html'
      ,controller: 'challengesCtrl'
      ,controllerAs: 'challenges'
    })

    .when("/list/friendschallenges", {
      templateUrl: 'templates/_challenges_all_jack.html'
      ,controller: 'analyticsCtrl'
      ,controllerAs: 'analytics'
    })

    .when('/acceptchallenge', {
      templateUrl: 'templates/_accept_challenge.html'
      ,controller: 'challengesCtrl'
      ,controllerAs: 'challenges'
    })

    .when('/messages/:name',{
      templateUrl: 'templates/_messages_all.html'
      ,controller: 'messagesCtrl'
      ,controllerAs: 'message'
    })

    .when('/newresponse/:name', {
      templateUrl: 'templates/_new_response.html'
      ,controller: 'responseCtrl'
      ,controllerAs: 'response'
    })

    .when('/responses', {
      templateUrl: 'templates/_responses.html'
      ,controller: 'responseCtrl'
      ,controllerAs: 'response'
    })

    .when('/users', {
      templateUrl: 'templates/_users.html'
      ,controller: 'userCtrl'
      ,controllerAs: 'user'
    })

    .when('/users/:name', {
      templateUrl: 'templates/_singleUser.html'
      ,controller: 'userCtrl'
      ,controllerAs: 'user'
    })

    .when('/signup', {
      templateUrl: 'templates/_signup.html'
      ,controller: 'userCtrl'
      ,controllerAs: 'user'
    })

    .when('/signup/:name', {
      templateUrl: 'templates/_signup_challenge.html'
      ,controller: 'userCtrl'
      ,controllerAs: 'user'
    })

    .when('/newprofile', {
      templateUrl: 'templates/_newprofile.html'
      ,controller: 'userCtrl'
      ,controllerAs: 'user'
    })

    .when('/terms', {
      templateUrl: 'templates/_terms.html'
    })

    .when('/charities/:name', {
      templateUrl: 'templates/_singlecharity.html'
      ,controller: 'charityCtrl'
      ,controllerAs: 'charity'
    })

    .when('/charities', {
      templateUrl: 'templates/_charities.html'
      ,controller: 'charityCtrl'
      ,controllerAs: 'charity'
    })

    .when('/contact', {
      templateUrl: 'templates/_contact.html'
      ,controller: 'responseCtrl'
      ,controllerAs: 'response'
    })

    .when('/privacy', {
      templateUrl: 'templates/_privacy.html'
    })

    .when('/settleup', {
      templateUrl: 'templates/_settleup.html'
    })

    .when('/about', {
      templateUrl: 'templates/_about.html'
    })

    .when('/cms', {
      templateUrl: 'templates/_cms.html'
      ,controller: 'cmsCtrl'
      ,controllerAs: 'cms'
      // will eventually be 'cmsCtrl' and 'cms'
    })

    .when('/', {
      templateUrl: 'templates/_home.html'
      ,controller: 'challengesCtrl'
      ,controllerAs: 'challenges'
    })

    .otherwise('/');
}
