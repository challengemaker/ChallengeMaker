angular.module('responseController', [])

  .controller('responseCtrl', responseCtrl);

  responseCtrl.$inject = ['$http'];
  function responseCtrl($http){
    var self = this;
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
      var carouselCounter = 0;

      $('.backButton').on('click', function(){
        if(carouselCounter > 0){
          carouselCounter = carouselCounter -1;
          console.log(carouselCounter);
        }
      })
      $('.forwardButton').on('click', function(){
        if(carouselCounter < 4){
          carouselCounter++;
          console.log(carouselCounter);

          if (carouselCounter == 1) {
            $('.qDesc').animate({
              marginLeft: -300+"px",
              opacity: .5
            }, 700, function(){
              $('.questionContent').html("<div class='videoLink'><input value='video url' class='addUrl'/></div>");
              $('.videoLink').animate({
                marginLeft: 0+"px",
                opacity: 1
              }, 700)
            })




            $('.questionTitle').html("Add the URL to your response video");
          }

        }
      })
      console.log('yo yo');
      $http({
        method: "GET",
        url: "/api/charities",
        success: function(data){
          console.log(data);
        }
      })
      .then(function(data){
        console.log(data);
        self.allCharities = data.data;
      })
    //////begin jquery carousel if statement
    ////////////////////////////////////////

    /////end jquery carousel
    ////////////////////////

    ////end create new response
    }
    ///end getting all charities


  }
