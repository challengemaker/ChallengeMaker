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
        $('.customAmount')[0].textContent = "select amount from list"
        $('.paymentOptions').prepend(
          "<input id='paymentAmount' type='text' name='amount' placeholder='Enter Donation Amount'>"
        )
      }
      else if(self.paymentCounter){
        $('#paymentAmount').remove();
        $('.customAmount')[0].textContent = "or enter an amount"
        $('.paymentOptions').prepend(
          "<select class='amountDrop form-control' id='sell' name='amount'>"+
            "<option value='5.00'>$5.00</option>"+
            "<option value='10.00'>$10.00</option>"+
            "<option value='25.00' selected>$25.00</option>"+
            "<option value='50.00'>$50.00</option>"+
            "<option value='100.00'>$100.00</option>"+
          "</select>"
        )
      }

    })

    ///////must set the x-button, which resets back to the signle challenge page
    ////////////////////////////////////////////////////////////////////////////
    $('.xBar').on('click', function(){
      var challengeName = window.location.hash.split("/")[2]
      $('.xBar').css({
        backgroundColor: '#D4D4D4'
        ,color: 'white'
      })
      setTimeout(function(){
        window.location.hash = "#/challenges/"+challengeName
      }, 150)

    })
    function moveXButton(){
      var windowSize = $(window).width()
      if(windowSize > 515){
        $('.xBar').css({
          marginLeft: '95%'
        })
      } else if(windowSize > 0){
        $('.xBar').css({
          marginLeft: '82%'
        })
      }
    }
    moveXButton()
    $(window).resize(function(){
      moveXButton()
    })
    //////additional x-functionality so that it resizes at smaller sizes
    /////////end click function
    ///////////////////////////


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
            console.log(err)//////this sends the error message callback that we use to populate a callback, popup function comes next
            $('.paymentContainer').prepend(
              "<div class='responseLightboxPaymentError'>" +
                "<div class='responseLightboxText'>"+
                  "<p>Oops, there was an issue with your credit card, please try again</p>" +
                "</div>"+
                "<div class='okButton'> OK </div>"+
              "</div>"
            )
            $('.okButton').on('click', function(){
              $('.okButton').css({
                backgroundColor: '#C31C85'
                ,color: "white"
              })
              setTimeout(function(){
                $('.responseLightbox').remove()
              }, 100)
            })
            $('.okButton').on('mouseenter', function(){
              $('.okButton').css({
                backgroundColor: '#D4D4D4'
              })
            })
            $('.okButton').on('mouseleave', function(){
              $('.okButton').css({
                backgroundColor: '#F5F5F5'
              })
            })
            function responsiveError(){
              if($(window).width() < 525){
                console.log('lol');
                $('.responseLightboxText').css({
                  fontSize: "16px"
                })
              }
            }
            responsiveError()
            $(window).resize(function(){
              responsiveError()
            })
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
                var sendeeEmail = data.data.user.email
                console.log(sendeeEmail)
                $http({
                  method: "POST"
                  ,url: "/api/sendemail/donation"
                  ,data: {sendeeEmail: sendeeEmail}
                })
                .then(function(data){
                  console.log(data)
                  console.log('almost thereeeee')
                  $('#checkout').submit()
                })
              });
          }
        })
      });

//////end controller
  }
