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
          "<select class='amountDrop' name='amountDropdown'>"+
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

    $('#submitPayment').on('click', function(evt){
      // evt.preventDefault();
      console.log(evt);
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
        }, function(data){
          window.localStorage.testData = data;
        }
      );
      console.log(braintree.setup());
    })

    // $('#submitPayment').on('click', function(){
    //   console.log('in here at least');
    //   var form = $('#checkout');
    //   form.action = "/checkout";
    //   form.method = 'post';
    //   form.submit(function(data){
    //     console.log('form submitted, i think');
    //     console.log(data);
    //   });
    // })
//////end controller
  }
