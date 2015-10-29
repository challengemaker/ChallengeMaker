var app = angular.module('paymentsController', [])

  .controller('paymentsCtrl', paymentsCtrl)

  paymentsCtrl.$inject = ['$http'];

  function paymentsCtrl($http){
    var self = this;

    self.paymentCounter = true;

    $('.customAmount').on('click', function(){
      self.paymentCounter = !self.paymentCounter;
      if(!self.paymentCounter){
        $('.amountDrop').remove();
        $('.customAmount')[0].textContent = "or select from list"
        $('.paymentOptions').prepend(
          "<input id='paymentAmount' type='text' name='amount' placeholder='How much would you like to donate?'>"
        )
      }
      else if(self.paymentCounter){
        $('#paymentAmount').remove();
        $('.customAmount')[0].textContent = "or enter custom amount"
        $('.paymentOptions').prepend(
          "<select class='amountDrop' name='amount'>"+
            "<option value='5.00'>$5.00</option>"+
            "<option value='10.00'>$10.00</option>"+
            "<option value='15.00'>$15.00</option>"+
            "<option value='20.00'>$20.00</option>"+
            "<option value='25.00'>$25.00</option>"+
            "<option value='30.00'>$30.00</option>"+
          "</select>"
        )
      }

    })

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
        'dropin', {
          container: "payment-form"
          ,onError: function(err){
            console.log(err);
          }
          ,redirect_url: "#/"
          ,onPaymentMethodReceived: function(nonce){
            console.log(nonce);
            $('#checkout').append(
              "<input type='hidden' name='payment_method_nonce' value='" + nonce.nonce + "'></input>"
            )
            $('#checkout').submit();
          }
        })
      });
//////end controller
  }
