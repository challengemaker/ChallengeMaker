angular.module('responseController', [])

  .controller('responseCtrl', responseCtrl);

  responseCtrl.$inject = ['$http', "$routeParams"];
  function responseCtrl($http, $routeParams){
    var self = this;
    console.log($routeParams);

    ////create submit-new-response section
    //////////////////////////////////////
    $('#submitResponse').on('click', function(){
      var title = $('#responseTitle').val();
      var description = $('#responseDescription').val();
      var video = $('#responseVid').val();
      $http({
        method: "POST",
        url: "api/responses",
        data: {title: title, description: description, video_url: video},
        success: function(){
          console.log('I think it worked');
        }
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
          console.log(data.data);
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
          console.log(carouselCounter);
          carouselCounter--;
          console.log(carouselCounter);

          if(carouselCounter == 0){
            console.log(tunnelMargin);
            tunnelMargin += 550;
            $('.questionTunnel').animate({
              marginLeft: tunnelMargin+"px"
            })
          }
          else if(carouselCounter == 1){
            console.log(tunnelMargin);
            tunnelMargin += 550;
            $('.questionTunnel').animate({
              marginLeft: tunnelMargin+"px"
            })
          }
          else if(carouselCounter == 2){
            console.log(tunnelMargin);
            tunnelMargin += 550;
            $('.questionTunnel').animate({
              marginLeft: tunnelMargin+"px"
            })
          }
          // else if(carouselCounter == 3){
          //   console.log(tunnelMargin);
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
        console.log(self.video);
        self.name = $('.signup2').val();
        if(carouselCounter < 3){
          carouselCounter++;
          if (carouselCounter == 1) {
            tunnelMargin = tunnelMargin-550;
            $('.questionTunnel').animate({
              marginLeft: tunnelMargin+"px"
            })
          } else if (carouselCounter == 2) {
            tunnelMargin = tunnelMargin-550;
            $('.questionTunnel').animate({
              marginLeft: tunnelMargin+"px"
            })
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
        console.log(data);
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
