angular.module('donationController', [])

  .controller('donationCtrl', donationCtrl)

  donationCtrl.$inject = ['$http']
  function donationCtrl($http){
  //////////////////////////////////
  /////////begin donation controller
    var self = this
    self.jimmysMessage = "Boom!"//////our test messge in the upper right, for sanity-check purposes (you see the handlebars, the angular is out)

    /////////////////////////////////////////////////////////////////////////
    ///////////begin button logic for the challenge path forward-back buttons

    $("#submitPayment").on('click', function(){
      // $('.paymentContainer').animate({
      //   marginLeft: "-500px"
      //   ,opacity: 0
      // })
    })

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


    $('.donateChallengeFriends').on('click', function(){
      var emailArr = $('.challengeFriends')
      var realEmails = []
      for (var i = 0; i < emailArr.length; i++) {
        var friendEmail = emailArr[i].value
        var emailArray = friendEmail.split('@')
        var testAt = friendEmail.split('@').length
        if(testAt > 1){
          ///////// only if there's at least one '@'
          emailArray.shift()
          /////////email array should no start at 'google.com' or whatever comes after the at
          /////now we split to check for a period
          var periodTestArray = emailArray[0].split('.')
          var periodTestLength = emailArray[0].split('.').length
          if(periodTestLength > 1){
            console.log(friendEmail+' looks pretty good to me!')
            realEmails.push({email: friendEmail})
            $http({
              method: "POST"
              ,url: "/api/emails"
              ,data: {address: friendEmail}
            })
            .then(function(data){
              console.log('email upoload worked')
              console.log(data);
            })
          } else {
            console.log('I dont see a period in there')
          }
        } else {
          console.log('dude wheres your at, at?')
        }
      /////////end for-loop
      }
      ///////
      ////////end email parsing to challenge Friends
      //////////////////////////////////////////////
      ////the below http send mail to all friends a user has challenged
      var url = window.location.hash.split('/')
      console.log(url);
      $http.get('api/challenges/'+url[3])
        .then(function(data){
          console.log(data)
          var responseData = {responseCreator: window.localStorage.sessionUser, charityName: data.data.charity[0], challenge: url[3].split('-').join(' ')}
          $http({
            method: 'POST'
            ,url: "/api/sendemail/challengefriends"
            ,data: {emails: realEmails, responseData: responseData}
          })
          .then(function(data){
            console.log(data);
          })
        })
        window.location.hash = "#/donate/"+window.location.hash.split('/')[3]
    })

    $('.donateHome').on('click', function(){
      window.location.hash = "#/donate/"+window.location.hash.split('/')[3]
    })
    ///////////////end logic for forward and back button in the challenge path
    //////////////////////////////////////////////////////////////////////////

    ///////must set the x-button, which resets back to the signle challenge page
    ////////////////////////////////////////////////////////////////////////////
    $('.xBar').on('click', function(){
      var challengeName = window.location.hash.split("/")[3]
      var challengeNameDonate = window.location.hash.split('/')[2]
      if(window.location.hash.split('/')[2] == "challengefriends"){
        $('.xBar').css({
          backgroundColor: '#D4D4D4'
          ,color: 'white'
        })
        setTimeout(function(){
          window.location.hash = "#/challenges/"+challengeName
        }, 150)
      } else {
        $('.xBar').css({
          backgroundColor: '#D4D4D4'
          ,color: 'white'
        })
        setTimeout(function(){
          window.location.hash = "#/challenges/"+challengeNameDonate
        }, 150)
      }
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
    //////////////////////////////////////
    ///////begin section to submit payment
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
            ////////////////////////////////////////
            ////////adding logic for error popup box
            $('.paymentContainer').prepend(
              "<div class='responseLightboxPaymentError'>" +
                "<div class='responseLightboxText'>"+
                  "<p>Oops, there was an issue with your credit card. Please try again</p>" +
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
                $('.responseLightboxPaymentError').remove()
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
            ////////////////////////////////////////
            ////////adding logic for error popup box
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
      })
      //////////////////////////////////////
      ///////end section to submit payment

  ///////end of the the Donation Controller
  /////////////////////////////////////////
  }
