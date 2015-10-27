var app = angular.module('paymentsController', [])

  .controller('paymentsCtrl', paymentsCtrl)

  paymentsCtrl.$inject = ['$http'];

  function paymentsCtrl($http){
    console.log('lol paymnets');
    $('.ohyeababy').on('click', function(){
      $http({
        method: "GET"
        ,url: "/client_token"
      })
      .then(function(data){
        console.log(data);
      })
    })
  }
