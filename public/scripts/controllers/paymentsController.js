var app = angular.module('paymentsController', [])

  .controller('paymentsCtrl', paymentsCtrl)

  paymentsCtrl.$inject = ['$http'];

  function paymentsCtrl($http){
    console.log('lol paymnets');
    $http({
      method: "GET"
      ,url: "/client_token"
    })
    .then(function(data){
      console.log(data);
      self.token = data.data;
      braintree.setup(
      self.token,
      "dropin", {
        container: "payment-form"
      });
    })


  }
