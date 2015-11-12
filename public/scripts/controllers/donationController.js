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
        window.location.hash = "#/donate/"+window.location.hash.split('/')[4]
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
      $('.xBar').css({
        backgroundColor: '#C31C85'
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

  ///////end of the the Donation Controller
  /////////////////////////////////////////
  }
