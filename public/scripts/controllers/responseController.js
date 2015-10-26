angular.module('responseController', [])

  .controller('responseCtrl', responseCtrl);

  responseCtrl.$inject = ['$http', "$routeParams"];
  function responseCtrl($http, $routeParams){
    var self = this;

    var url = window.location.hash.split('/');
    if( url[1] = "newresponse"){
      console.log('yoyoyoyoyoyoyoyoy');
      console.log(url[2]);
      // var challengeName = url[2].split('-').join(' ');
      // console.log(challengeName);
      $http.get('api/challenges/'+url[2])
        .then(function(data){
          console.log(data);
          self.charityLink = data.data.charityLink;
          console.log(self.charityLink);
          $('.submitDon').on('click', function(){
            window.open(self.charityLink, target="_blank")
          })
        })
      }
    self.checkYoutube = function checkYoutube(){
      //////////parse the link on each keyup to make sure it's getting a proper youtube reading
      var currUrl = $('.responseTitle').val();

      var urlFunc = function(){
        var urlArr = currUrl.split("/");
        var httpCheck = urlArr[0].slice(0, 6);
        console.log(httpCheck);
        if(httpCheck == "https:" && urlArr.join("").length != 6){
          console.log('its an http');
          urlArr.shift();
          urlArr.shift();
          if(urlArr.join("").length > 5){
            var shortUrl1 = urlArr.join("").slice(0, 9);
            var shortUrl2 = urlArr.join("").slice(0, 5);
          }else {
            var shortUrl1 = "blah";
            var shortUrl2 = "blah";
          }
        } else {
          console.log('notan http');
          var shortUrl1 = urlArr.join("").slice(0, 9);
          var shortUrl2 = urlArr.join("").slice(0, 5);
        }
        if(shortUrl1 == "www.youtu" || shortUrl2 == "youtu"){
          console.log('looks right');
          $('.responseTitle').css({
            backgroundColor: "#D8F9FF"
          })
        } else {
          console.log("what the fuck!");
          $('.responseTitle').css({
            backgroundColor: "#FFCCE0"
          })
        }

        // if()
      }
      urlFunc();
      /////end parsing the url for youtubability

      if(currUrl){
        console.log(currUrl);
      } else{
        console.log('boooo');
      }
    }

    setInterval(function(){
      var contMargin = ((window.innerWidth/2) - 280)+"px";
      $('.questionHolder').css({marginLeft: contMargin})
    }, 50)
    ////create submit-new-response section
    //////////////////////////////////////
    $('.submitDon').on('click', function(){
      var videoUrl = $('.responseTitle').val();
      var emails = function(){
        var emailList = [];
        var rawList = $('.challengeFriends');
        for (var i = 0; i < rawList.length; i++) {
          var length = rawList[i].value.length;
          if(length > 2){
            emailList.push(rawList[i].value)
          }
          else{
          }
        }
        var delivery = {videoUrl: videoUrl, emails: emailList}
        return delivery;
      }
      var emailsL = emails();

      $http({
        method: "POST",
        url: "api/responses",
        data: emailsL,
      })
      .then(function(data){
      })
    })

    $('.submitDon').on("click", function(){
      if (window.localStorage.sessionUser && window.localStorage.sessionUser != "none") {
      window.location.hash = "#/"
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

    // $('.reviewResponse').on('click', function(){
    //   tunnelMargin = tunnelMargin - 550;
    //   $('.rTitle').text(self.title);
    //   $('.rVideo').text(self.video);
    //   $('.rDescription').text(self.description);
    //   $('.questionTunnel').animate({
    //     marginLeft: tunnelMargin+"px"
    //   })
    // })

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
