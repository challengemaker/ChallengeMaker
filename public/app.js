//this creates our app in angular and adds any depencies (internal or third party)
angular.module('challengeMaker', ['mainController', "challengesController", 'userController', 'responseController', 'charityController', 'analyticsController', 'paymentsController', 'app.routes', 'ngRoute'])

.config( function($httpProvider, $sceProvider){
});
