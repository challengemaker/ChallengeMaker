var app = angular.module('paymentsController', [])

  .controller('paymentsCtrl', paymentsCtrl)

  paymentsCtrl.$inject = ['$http'];

  function paymentsCtrl($http){
    console.log('lol payments');
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
  //
  // $('#checkout').submit(function(event){
  //   console.log('hey there');
  //   event.preventDefault();
  // })

  $('#checkout').on('submit', function(){
    console.log('submitted baby');
  })