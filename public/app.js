//this creates our app in angular and adds any depencies (internal or third party)

angular.module('challengeMaker', ['mainCtrl', 'app.routes', 'ngRoute', 'userCtrl'])

.config(function($httpProvider));
