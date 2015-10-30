var app = angular.module('paymentsController', [])

  .controller('paymentsCtrl', paymentsCtrl)

  paymentsCtrl.$inject = ['$http'];

  function paymentsCtrl($http){
    var self = this;

    self.paymentCounter = true;
    self.paymentChallenge = window.location.hash.split('/')[2];
    console.log(self.paymentChallenge);

    $('.customAmount').on('click', function(){
      self.paymentCounter = !self.paymentCounter;
      if(!self.paymentCounter){
        $('.amountDrop').remove();
        $('.customAmount')[0].textContent = "Select From List"
        $('.paymentOptions').prepend(
          "<input id='paymentAmount' type='text' name='amount' placeholder='Enter Donation Amount'>"
        )
      }
      else if(self.paymentCounter){
        $('#paymentAmount').remove();
        $('.customAmount')[0].textContent = "Enter Custom Amount"
        $('.paymentOptions').prepend(
          "<select class='amountDrop form-control' id='sell' name='amount'>"+
            "<option value='5.00'>$5.00</option>"+
            "<option value='10.00'>$10.00</option>"+
            "<option value='20.00' selected>$20.00</option>"+
            "<option value='50.00'>$50.00</option>"+
            "<option value='100.00'>$100.00</option>"+
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
              "<input type='hidden' name='payment_method_nonce' value='" + nonce.nonce + "'></input>"+
              "<input type='hidden' name='challenge' value='" + self.paymentChallenge + "'></input>"
            )
              console.log('HOLLLLLLLLLLLLA');
              var userName = window.localStorage.sessionUser;
              console.log(userName);
              $http({
                method: "GET"
                ,url: "/api/users/"+userName
              })
              .then(function(data){
                console.log(data);
                var sendeeEmail = data.data.user.email;
                console.log(sendeeEmail);
                $http({
                  method: "POST"
                  ,url: "/api/sendemail/donation"
                  ,data: {sendeeEmail: sendeeEmail}
                })
                .then(function(data){
                  console.log(data);
                  console.log('almost thereeeee');
                  $('#checkout').submit();
                })
              });

          }
        })
      });
//////end controller
  }
