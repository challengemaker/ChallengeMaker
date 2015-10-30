angular.module('responseController', [])

  .controller('responseCtrl', responseCtrl);

  responseCtrl.$inject = ['$http', "$routeParams"];
  function responseCtrl($http, $routeParams){
    var self = this;

    var thisChallenge = window.location.hash.split('/')[2];
    console.log(thisChallenge);

    //////some quick contact form stuff, you can find at templates/_contact.html
    ///////////////////////////////////////////
    ///////////////////////////////////////////
    if(window.location.hash.split('/')[1] = "contact"){
      $('.formSubmit').on('click', function(){
        var email = $('.formEmail').val();
        var subject = $('.formSubject').val();
        var message = $('.formMessage').val();

        console.log(email);
        console.log(subject);
        console.log(message);
        /////////send contact email
        $http({
          method: "POST"
          ,url: "/api/sendemail/contact"
          ,data: {sendeeEmail: "jack.connor83@gmail.com", subject: subject, text: message}
        })
        .then(function(data){
          console.log(data);
        })
        //////finish sending email
        //////now let's collect the emails
        $http({
          method: "POST"
          ,url: "/api/emails"
          ,data: {address: email}
        })
        .then(function(err, email){
          console.log(email);
        })
      })
    }
    /////End contact form stuff///////////////
    ///////////////////////////////////////////
    ///////////////////////////////////////////
    $http({
      method: "GET"
      ,url: "/api/challenges/"+thisChallenge
    })
    .then(function(data){
      console.log(data);
      self.thisPhoto = data.data.photo;
      self.thisCharity = data.data.charity[0];
    })

    var submitChallenge = function(){
      /////collecting all data we'll need for
      var userName = window.localStorage.sessionUser;
      var videoUrl = $('.responseTitle').val();
      var cName = window.location.hash.split('/')[2].split("/").join(" ");
      ///////collect all email and push into "emailList"
      var emailList = [];
      var rawList = $('.challengeFriends');
      // console.log(rawList);
      for (var i = 0; i < rawList.length; i++) {
        emailList.push(rawList[i].value);
      }
      var responsePackage = {responseCreator: userName, emails: emailList, video: videoUrl, challenge: cName }
      ///////lets chain our https in order: search id, post challenge friends, post response
      $http({
        method: "GET"
        ,url: "/api/users/"+userName
      })
      .then(function(data){
        //////this callback has all the users (signed in user's) information
        responsePackage.userId = data.data.user._id;
        // console.log(responsePackage);
        ////$http call to post the friendschallenge to friends
        console.log(responsePackage);
        $http({
          method: "POST"
          ,url: "/api/challengeFriends"
          ,data: {
            senderId: responsePackage.userId,
            senderName: responsePackage.responseCreator,
            sendeeEmail: responsePackage.emails,
            friendVideoUrl: responsePackage.video,
            challenge: responsePackage.challenge
          }
        })
        .then(function(data){
          console.log(data);
          /////this should be the data response from the post request, and we now post the challenge info to db
          console.log(responsePackage);
          $http({
            method: "Post"
            ,url: "/api/responses"
            ,data: {
              creator: responsePackage.responseCreator,
              creatorId: responsePackage.userId,
              videoUrl: responsePackage.video,
              challenge: responsePackage.challenge,
              emails: responsePackage.emails
            }
          })
          .then(function(data){
            console.log(data);
            var url = window.location.hash.split('/');
            $http.get('api/challenges/'+url[2])
              .then(function(data){
                self.charityLink = data.data.charityLink;

                //////send the email thanking them for making a challenge
                console.log(window.localStorage);
                console.log(window.localStorage.sessionUser);
                $http({
                  method: "GET"
                  ,url: "/api/users/"+window.localStorage.sessionUser
                })
                .then(function(userObj){
                  console.log(userObj);
                  var sendeeEmail = userObj.data.user.email;
                  console.log(sendeeEmail);
                  $http({
                    method: "POST"
                    ,url: "/api/sendemail/challengecomplete"
                    ,data: {sendeeEmail: sendeeEmail}
                  })
                })
                //////end sending challenge thank you email


                $('.goToDonation').on('click', function(){
                  window.open(self.charityLink, target="_blank");
                  window.location.hash = "#/challenges/"+url[2];
                })
              })
          })
        })
      })
    }
    setInterval(function(){
      var contMargin = ((window.innerWidth/2) - 280)+"px";
      $('.questionHolder').css({marginLeft: contMargin})
    }, 50)
    ////create submit-new-response section
    //////////////////////////////////////

    $('.goToDonation').on("click", function(){
      if (window.localStorage.sessionUser && window.localStorage.sessionUser != "none") {
        window.location.hash = "#/challenges/"+window.location.hash.split('/')[2]
      } else {
        window.location.hash = "#/signup"
      }
    })

    $(".goToLogin").on('click', function(){
      window.location.hash = "#/login"
    })

    $(".backToSite").on('click', function(){
      window.location.hash = "#/"
    })
    ////////////////////////////
    ///end creating new response

    ////show all responses on /responses
    if(window.location.hash == "#/responses"){
      $http({
        url: '/api/responses',
        method: 'GET'
      })
        .then(function(data){
          self.allResponses = data.data;
        })
    }
    //////end showing all responses
    ///////////////////////////////

    /////begin getting all charities (will be a factory)
    /////and creating a new response
    var hash = window.location.hash.split('/');
    if(hash[1] == "newresponse" && hash[2]){
      ////


      ///setting all input-clearing
      $('.signup1').on('click', function(evt){
        $(".signup1").val('');
      });
      $('.signup2').on('click', function(){
        $('.signup2').val('');
      });
      $('.signup3').on('click', function(){
        $('.signup3').val('');
      });
      $('.signup4').on('click', function(){
        $('.signup4').val('');
      });
      $('#email1').on('click', function(){
        $('#email1').val('');
      });
      $('#email2').on('click', function(){
        $('#email2').val('');
      });
      $('#email3').on('click', function(){
        $('#email3').val('');
      });
      $('#email4').on('click', function(){
        $('#email4').val('');
      });
      $('.responseTitle').on('click', function(){
        $('.responseTitle').val('');
      });

      //sizing the questions properly


      var carouselCounter = 0;
      var tunnelMargin = 0;
      if (carouselCounter == 0) {

      }

      $('.backButton').on('click', function(){
        if(carouselCounter > 0){
          carouselCounter--;

          if(carouselCounter == 0){
            $('.forwardButton').html(
              "NEXT"+
               "<span class=glyphicon"+ "glyphicon-chevron-right"+ "aria-hidden='true'></span>"
            );
            tunnelMargin += 550;
            $('.questionTunnel').animate({
              marginLeft: tunnelMargin+"px"
            })
          }
          else if(carouselCounter == 1){
            tunnelMargin += 550;
            $('.questionTunnel').animate({
              marginLeft: tunnelMargin+"px"
            })
          }
          else if(carouselCounter == 2){
            tunnelMargin += 550;
            $('.questionTunnel').animate({
              marginLeft: tunnelMargin+"px"
            })
          }
          // else if(carouselCounter == 3){
          //   tunnelMargin += 550;
          //   $('.questionTunnel').animate({
          //     marginLeft: tunnelMargin+"px"
          //   })
          // }
        }
      })
      $('.forwardButton').on('click', function(){
        self.title = $('.responseTitle').val();
        self.description = $('.responseDesc').val();
        self.video = $('.videoUrl').val();
        self.name = $('.signup2').val();
        if(carouselCounter < 3){
          carouselCounter++;
          if (carouselCounter == 1) {
            $('.forwardButton').text("SUBMIT!");
            $('.forwardButton').addClass("submitDon");
            $('.submitDon').on('click', function(){
              ////begin checking to make sure that the response is actually a youtube link
              var check = /[\b(youtu(be))\b]/;
              var checkUrl = $('.responseTitle').val();

              if(check.test(checkUrl)){
                console.log('test worked');
                submitChallenge()
              } else {
                console.log('try agin');
              }
            })
            /////end checking youtube url and running https
            /////////////////////////////

            tunnelMargin = tunnelMargin-550;
            $('.questionTunnel').animate({
              marginLeft: tunnelMargin+"px"
            })
          } else if (carouselCounter == 2) {
            tunnelMargin = tunnelMargin-550;
            $('.questionTunnel').animate({
              marginLeft: tunnelMargin+"px"
            })
            $('.carouselButtonHolder').html('');
          }
          // else if (carouselCounter == 3) {
          //   tunnelMargin = tunnelMargin-550;
          //   $('.questionTunnel').animate({
          //     marginLeft: tunnelMargin+"px"
          //   })
          // }
        }
      })
      $http({
        method: "GET",
        url: "/api/charities",
        success: function(data){
        }
      })
      .then(function(data){
        self.allCharities = data.data;
      })
    }

    $('.createResponse').on('click', function(){
      carouselCounter++;
      ////this response modelling will be done in a factory later
      var response = {
        title: self.title,
        description: self.description,
        video: self.video,
        username: self.name
      }
      $http({
        method: "POST",
        url: "api/responses",
        data: response
      })
      .then(function(data){
        window.location.hash = "#/challenges/"+$routeParams.name
      })
    })
    // $('.forwardButton').on('click', function(){
    //   $('.forwardButton').css('opacity', 0);
    //   $('.backButton').css('opacity', 0);
    // })

    $('.finishResponse').on('click', function(){
      window.location.hash = "#/challenges/"+$routeParams.name
    })
  ////end controller
  }
