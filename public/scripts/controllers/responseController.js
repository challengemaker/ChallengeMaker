angular.module('responseController', [])

  .controller('responseCtrl', responseCtrl);

  responseCtrl.$inject = ['$http'];
  function responseCtrl($http){
    var self = this;
    console.log('response controller working');

    /////this creates the new response
    ///below works
    $http({
      method: "POST",
      url: '/api/responses',
      data: {'title':"hell yea fucking did it", 'description':"nailed it"}
    })
    .then(function(data){
      console.log(data);
    })
    ///end creating new response
  }
