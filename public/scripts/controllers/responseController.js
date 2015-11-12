angular.module('responseController', [])

  .controller('responseCtrl', responseCtrl);

  responseCtrl.$inject = ['$http', "$routeParams"];
  function responseCtrl($http, $routeParams){
    var self = this

    var thisChallenge = window.location.hash.split('/')[2];
    console.log(thisChallenge)

    //////some quick contact form stuff, you can find at templates/_contact.html
    ///////////////////////////////////////////
    ///////////////////////////////////////////
    if(window.location.hash.split('/')[1] = "contact"){
      $('.formSubmit').on('click', function(){
        var email = $('.formEmail').val();
        var subject = $('.formSubject').val();
        var message = $('.formMessage').val();
        /////////send contact email
        $http({
          method: "POST"
          ,url: "/api/sendemail/contact"
          ,data: {sendeeEmail: "jason@challengemaker.com"}
        })
        .then(function(data){
          console.log(data);
          $http({
            method: "POST"
            ,url: "/api/sendemail/contactthankyou"
            ,data: {sendeeEmail: email}
          })
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
          window.location.hash = "#/";
        })
      })
    }
    /////End contact form stuff///////////////
    ///////////////////////////////////////////
    ///////////////////////////////////////////

    ///////get all challenges
    $http({
      method: "GET"
      ,url: "/api/challenges/"+thisChallenge
    })
    .then(function(data){
      // self.thisPhoto = data.data.photo;
      self.thisCharity = data.data.charityLink;
      self.thisCharityName = data.data.charity[0]
    })
    //////end get all challenges

    /////function to make the input box light up depending on what kind of link is inside of it
    function checkRealUrl(urlToCheck){
      $('.responseLightbox').remove()
      $('.forwardButton').removeClass('forwardOn')
      if(urlToCheck){
        // $('.responseTitle').css({
        //   backgroundColor: "#EBFFF2"
        // })
        $('.forwardButton').addClass('forwardOn')
        $('.forwardOn').on('click', function(){
          var inputVal = $('.responseTitle').val()
          var checkUrl = getYoutubeEmbed(inputVal)///this returns either the embed code or a "false", and so checks for validity
          if(checkUrl){
            getClickForward()
          } else {
            $('.responseOuter').prepend(
              "<div class='responseLightbox'>" +
                "<div class='okButton'> Ok </div>"+
              "</div>"
            )
            $('.okButton').on('click', function(){
              $('.okButton').css({
                backgroundColor: "#A400A4"
              })
              setTimeout(function(){
                $('.responseLightbox').remove()
              }, 100)
            })
          }
        })
      } else {
        // $('.responseTitle').css({
        //   backgroundColor: "#FFCCE5"
        // })
        $('.responseOuter').prepend(
          "<div class='responseLightbox'>" +
            "<div class='responseLightText'>"+
              "<p>Oops, your link didn't work, please try again</p>" +
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
      }
    }

    $('.responseTitle').on('paste', function(){
      setTimeout(function(){
        var inputVal = $('.responseTitle').val()
        var checkUrl = getYoutubeEmbed(inputVal)///this returns either the embed code or a "false", and so checks for validity
        checkRealUrl(checkUrl)/////this places all teh DOM event stuff
      }, 100)
    })
    $('.forwardButtonLightbox').on('click', function(){
      var inputVal = $('.responseTitle').val()
      var checkUrl = getYoutubeEmbed(inputVal)///this returns either the embed code or a "false", and so checks for validity
      checkRealUrl(checkUrl)/////this places all teh DOM event stuff
    })

    $('.forwardButton').on('mouseenter', function(){
      // $('.forwardButton')[0].src("/assets/NEXT_over.svg")
      console.log($('.forwardButton')[0].src = "/assets/NEXT_over.svg");
    })

    $('.forwardButton').on('mouseleave', function(){
      // $('.forwardButton')[0].src("/assets/NEXT_over.svg")
      console.log($('.forwardButton')[0].src = "/assets/NEXT.svg");
    })

    var submitChallenge = function(){
      /////collecting all data we'll need for
      var inputUrl = $('.responseTitle').val()
      var embedCodeForDb = getYoutubeEmbed(inputUrl)
      if(!embedCodeForDb){
        return;
      }
      var userName = window.localStorage.sessionUser
      // var videoUrl = $('.responseTitle').val();
      var cName = window.location.hash.split('/')[2].split("/").join(" ");
      var responsePackage = {responseCreator: userName, video: embedCodeForDb, challenge: cName }
      ///////lets chain our https in order: search id, post challenge friends, post response
      $http({
        method: "GET"
        ,url: "/api/users/"+userName
      })
      .then(function(data){
        //////this callback has all the users (signed in user's) information
        responsePackage.userId = data.data.user._id
        self.sendeeEmail = data.data.user.email
        ////$http call to post the friendschallenge to friends
        var rightNow = new Date();
        $http({
          method: "POST"
          ,url: "/api/challengeFriends"
          ,data: {
            senderId: responsePackage.userId,
            senderName: responsePackage.responseCreator,
            sendeeEmail: responsePackage.emails,
            friendVideoUrl: responsePackage.video,
            challenge: responsePackage.challenge,
            date: rightNow
          }
        })
        .then(function(data){
          /////this should be the data response from the post request, and we now post the challenge info to db
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
            var url = window.location.hash.split('/')
            console.log(url);
            $http.get('api/challenges/'+url[2])
              .then(function(data){
                self.charityName = data.data.charity[0]
                self.charityLink = data.data.charityLink
                //////send the email thanking them for making a challenge
                //////now let's send an email to thank them for completing a challenge
                $http({
                  method: "POST"
                  ,url: "/api/sendemail/challengecomplete"
                  ,data: {sendeeEmail: self.sendeeEmail}
                })
                ///now lets send the challenge email to the friends
                .then(function(){
                  //////////////////////////////////////////////////////////
                  ////////the following will fo through all the email addresses, checking for legitimacy and filtering out all that aren't real
                  var emailArr = $('.challengeFriends')
                  var realEmails = []
                  for (var i = 0; i < emailArr.length; i++) {
                    var friendEmail = emailArr[i].value;
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
                        realEmails.push({email: friendEmail})
                        $http({
                          method: "POST"
                          ,url: "/api/emails"
                          ,data: {address: friendEmail}
                        })
                        .then(function(data){
                        })
                      } else {
                      }
                    } else {
                    }
                  /////////end for-loop
                  }
                  responsePackage.charityLink = self.charityLink
                  responsePackage.charityName = self.charityName
                  ///////
                  ////////end email parsing to challenge Friends
                  //////////////////////////////////////////////
                  ////the below http send mail to all friends a user has challenged
                  $http({
                    method: 'POST'
                    ,url: "/api/sendemail/challengefriends"
                    ,data: {emails: realEmails, responseData: responsePackage}
                  })
                  .then(function(data){
                  })
                })
              })
          })
        })
      })
    }

    setInterval(function(){
      var contMargin = ((window.innerWidth/2) - 280)+"px"
      $('.questionHolder').css({marginLeft: contMargin})
    }, 50)
    ////create submit-new-response section
    //////////////////////////////////////

    $('.goToDonation').on("click", function(){
      if (window.localStorage.sessionUser && window.localStorage.sessionUser != "none") {
        window.open(self.thisCharity, target="_blank")
        window.location.hash = "#/";
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
      /////////////////////////////////////////////////////////////////////////
      ///////////begin button logic for the challenge path forward-back buttons
      var carouselCounter = 0;
      var tunnelMargin = 0;
      ////////begin logic for the back button
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
        }
      })
      /////////begin logic for the forward button
      var getClickForward = function(){
        self.title = $('.responseTitle').val()
        self.description = $('.responseDesc').val()
        self.video = $('.videoUrl').val()
        self.name = $('.signup2').val()
        if(carouselCounter < 3){
          carouselCounter++;
          if (carouselCounter == 1) {
            /////////add a class and event listener so thta the forward button can now submit the emails and youtube link response
            $('.forwardButton').text("SUBMIT!")
            $('.forwardButton').addClass("submitDon")
            $('.submitDon').on('click', function(){
              submitChallenge()
            })
            //////////end adding event listener to submit response
            tunnelMargin = tunnelMargin-550;
            $('.questionTunnel').animate({
              marginLeft: tunnelMargin+"px"
            })
          } else if (carouselCounter == 2) {
            window.location.hash = "#/payments/"+window.location.hash.split("/")[2]
            // tunnelMargin = tunnelMargin-550
            // $('.questionTunnel').animate({
            //   marginLeft: tunnelMargin+"px"
            // })
            // $('.carouselButtonHolder').html('')
          }
        }
      }

      // $('.forwardOn').on('click', getClickForward)

      // function(){
      //   self.title = $('.responseTitle').val();
      //   self.description = $('.responseDesc').val();
      //   self.video = $('.videoUrl').val();
      //   self.name = $('.signup2').val();
      //   if(carouselCounter < 3){
      //     carouselCounter++;
      //     if (carouselCounter == 1) {
      //       /////////add a class and event listener so thta the forward button can now submit the emails and youtube link response
      //       $('.forwardButton').text("SUBMIT!");
      //       $('.forwardButton').addClass("submitDon");
      //       $('.submitDon').on('click', function(){
      //         submitChallenge()
      //       })
      //       //////////end adding event listener to submit response
      //       tunnelMargin = tunnelMargin-550;
      //       $('.questionTunnel').animate({
      //         marginLeft: tunnelMargin+"px"
      //       })
      //     } else if (carouselCounter == 2) {
      //       tunnelMargin = tunnelMargin-550;
      //       $('.questionTunnel').animate({
      //         marginLeft: tunnelMargin+"px"
      //       })
      //       $('.carouselButtonHolder').html('');
      //     }
      //   }
      // })
      ///////////////end logic for forward and back button in the challenge path
      //////////////////////////////////////////////////////////////////////////

      $http({
        method: "GET",
        url: "/api/charities",
        success: function(data){
        }
      })
      .then(function(data){
        self.allCharities = data.data;
      })
    ///////end new responses
    }
    //////the function which we use to parse our youtube links
    function getYoutubeEmbed(youtubeUrl){
      if(youtubeUrl){
        var urlArray = youtubeUrl.split("/")
        ////////now let's split them into https - nonhttps groups
        if(urlArray[0] == "https:"){
          //////////this side is all inputs that begin with 'https:/'
          //we shift twice to get rid of the https and the empty space from our //
          urlArray.shift()
          urlArray.shift()
          ///////the array now begins at www.
          var checkWww = urlArray[0].split('.')////this is just the youtube.com part of the url (maybe with www, we'll see)
          if (checkWww[0] == 'www') {
            ////////this if will filter out any urls with a www begining
            checkWww.shift()
          }
          //////at this point forward, everything should be stripped of all https and www (if it began with https)
          if(checkWww[0] == "youtube"){
            //////checks for an embed or url-bar link type
            urlArray.shift()/////we just got rid of the youtube.com part
            //////now we need to chck of it's an embed link or not, but we're damn sure it's youtube
            if(urlArray[0] == 'embed'){
              /////we now know that this is an embed link
              urlArray.shift()///let's get rid of this, just for fun so it's just the link
              var embedCode = urlArray[0].split('?')[0]
              return embedCode
            } else {
              var embedCode = urlArray[0].split('=')[1].split('&')[0]
              if(embedCode) {return embedCode}
            }
          } else if(checkWww[0] == "youtu"){
            ///////checks for the youtu.be/ new embed format
            urlArray.shift()
            var embedCode = urlArray[0].split("?")[0]/////should be the embed code that youtube itself provides
            return embedCode
          } else {
            /////////urls that do not fit the youtube standard format and so which are, therefore, kaput
            return undefined
          }
        } else {
          //////////this side is all inputs of any type, as long as they don't begin with 'https:/'
          /////////
          return undefined
        }
      } else {
        /////below this only triggers if there is nothing in the youtube link
        return undefined
      }
    }
    /////end youtube parsing function
//////////////////end new response section
//////////////////////////////////////////
//////////////////////////////////////////

    $('.finishResponse').on('click', function(){
      window.location.hash = "#/challenges/"+$routeParams.name
    })

    ///////must set the x-button, which resets back to the signle challenge page
    ////////////////////////////////////////////////////////////////////////////
    $('.xBar').on('click', function(){
      var challengeName = window.location.hash.split("/")[2]
      $('.xBar').css({
        backgroundColor: '#D4D4D4'
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
  ////end controller
  }
