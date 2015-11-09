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
    $('.forwardButton').on('click', function(){
      self.title = $('.responseTitle').val();
      self.description = $('.responseDesc').val();
      self.video = $('.videoUrl').val();
      self.name = $('.signup2').val();
      if(carouselCounter < 3){
        carouselCounter++;
        if (carouselCounter == 1) {
          /////////add a class and event listener so thta the forward button can now submit the emails and youtube link response
          $('.forwardButton').text("SUBMIT!");
          $('.forwardButton').addClass("submitDon");
          $('.submitDon').on('click', function(){
            submitChallenge()
          })
          //////////end adding event listener to submit response
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
      }
    })
    ///////////////end logic for forward and back button in the challenge path
    //////////////////////////////////////////////////////////////////////////


  ///////end of the the Donation Controller
  /////////////////////////////////////////
  }
