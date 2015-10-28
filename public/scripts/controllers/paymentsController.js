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

    $('#submitPayment').on('click', function(){
      console.log('in here at least');
      var form = $('#checkout');
      form.action = "/checkout";
      form.method = 'post';
      form.submit(function(data){
        console.log('form submitted, i think');
        console.log(data);
      });
    })
//////end controller
  }
