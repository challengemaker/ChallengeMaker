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
          ,data: {sendeeEmail: "jack.connor83@gmail.com"}
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
      console.log(data);
      // self.thisPhoto = data.data.photo;
      self.thisCharity = data.data.charityLink;
      console.log(self.thisCharity);
      self.thisCharityName = data.data.charity[0]
    })
    //////end get all challenges

    /////function to make the input box light up depending on what kind of link is inside of it
    function checkRealUrl(urlToCheck){
      if(urlToCheck){
        $('.responseTitle').css({
          backgroundColor: "#EBFFF2"
        })
      } else {
        $('.responseTitle').css({
          backgroundColor: "#FFCCE5"
        })
      }
    }
    $('.responseTitle').on('paste', function(){
      console.log('the event fired');
      setTimeout(function(){
        var inputVal = $('.responseTitle').val()
        console.log(inputVal);
        var checkUrl = getYoutubeEmbed(inputVal)
        checkRealUrl(checkUrl)
      }, 100)

    })


    var submitChallenge = function(){
      /////collecting all data we'll need for
      var inputUrl = $('.responseTitle').val()
      console.log(inputUrl);
      var embedCodeForDb = getYoutubeEmbed(inputUrl)
      if(!embedCodeForDb){
        return;
      }
      var userName = window.localStorage.sessionUser;
      console.log(userName);
      // var videoUrl = $('.responseTitle').val();
      var cName = window.location.hash.split('/')[2].split("/").join(" ");
      ///////collect all email and push into "emailList"
      // var emailList = [];
      // var rawList = $('.challengeFriends');
      // // console.log(rawList);
      // for (var i = 0; i < rawList.length; i++) {
      //   emailList.push(rawList[i].value);
      // }
      var responsePackage = {responseCreator: userName, video: embedCodeForDb, challenge: cName }
      console.log(responsePackage);
      ///////lets chain our https in order: search id, post challenge friends, post response
      $http({
        method: "GET"
        ,url: "/api/users/"+userName
      })
      .then(function(data){
        console.log(data)
        //////this callback has all the users (signed in user's) information
        responsePackage.userId = data.data.user._id
        self.sendeeEmail = data.data.user.email
        console.log(responsePackage);
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
          console.log('challenge friends posted');
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
                console.log(data);
                self.charityLink = data.data.charityLink;
                console.log(self.charityLink)
                console.log(self.sendeeEmail)
                //////send the email thanking them for making a challenge
                //////now let's send an email to thank them
                console.log('sending our emaillllsllssllsls')
                $http({
                  method: "POST"
                  ,url: "/api/sendemail/challengecomplete"
                  ,data: {sendeeEmail: self.sendeeEmail}
                })
                .then(function(data){
                  console.log(data);
                })

                  // .then(function(){
                  //   var emailArr = $('.challengeFriends');
                  //   var realEmails = [];
                  //   for (var i = 0; i < emailArr.length; i++) {
                  //     var friendEmail = emailArr[i].value;
                  //     var checkEmail = /[\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b]/;
                  //     var checkUrlEmail = friendEmail;
                  //     if(friendEmail != "email" && checkEmail.test(checkUrlEmail)){
                  //       realEmails.push({email: friendEmail});
                  //     }
                  //   }
                    //////the below http send mail to all friends a user has challenged
                    // $http({
                    //   method: 'POST'
                    //   ,url: "/api/sendemail/challengefriends"
                    //   ,data: {}
                    //   // ,data: realEmails
                    // })
                    // .then(function(data){
                    // })
                  // })
                //////end sending challenge thank you email
              })
          })
        })
      })
    }

    //////tempoarry house for some bullshit
    // .then(function(email){
    //   var emailArr = $('.challengeFriends');
    //   var realEmails = [];
    //   for (var i = 0; i < emailArr.length; i++) {
    //     var friendEmail = emailArr[i].value;
    //     var checkEmail = [\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b]/;
    //     var checkUrlEmail = friendEmail;
    //     if(friendEmail != "email" && checkEmail.test(checkUrlEmail)){
    //       realEmails.push({email: friendEmail});
    //     }
    //   }
    //   $http({
    //     method: 'POST'
    //     ,url: "/api/sendemail/challenge"
    //     ,data: realEmails
    //   })
    //   .then(function(data){
    //     console.log(data);
    //   })
    ///////
    setInterval(function(){
      var contMargin = ((window.innerWidth/2) - 280)+"px";
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
      ////
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

      //////function which will take the embed code, and with other things, store it to the db
      // function postResponse(youtubeCodeArg){
      //   var embedCode = youtubeCodeArg()
      //   var response = {
      //     title: self.title,
      //     description: self.description,
      //     video: self.video,
      //     username: self.name
      //   }
      //   $http({
      //     method: "POST"
      //     ,url: "/api/responses/"
      //     ,data:
      //   })
      // }


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
              //////////////////////////////////////////
              //////begin if-solution to youtube parsing
              submitChallenge()
              // getYoutubeEmbed(inputUrl)
              // console.log(getYoutubeEmbed(inputUrl))
            })
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
              return embedCode
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
  ////end controller
  }
