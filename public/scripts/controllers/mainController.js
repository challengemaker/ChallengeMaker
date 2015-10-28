angular.module('mainController', [])

  .controller('mainCtrl', mainCtrl);

  mainCtrl.$inject = ['$http'];
  function mainCtrl($http){
    var self = this;
    var dropdownCounter = 0;
    var sessionUser = window.localStorage.sessionUser;
    if(localStorage.sessionToken && localStorage.sessionToken!= "false" && localStorage.sessionToken!= "none"){
      self.userSesh = "logout";
    }
    else{
      self.userSesh = "Sign In"
    }


    $('.logout').on('click', function(){
      self.userSesh = "Sign In";
      window.localStorage.sessionToken = "none"
      window.localStorage.sessionUser = "none"
      window.location.reload()
    });

    $(".logo").on('click', function(){
      window.location.hash = "#/"
      location.reload()
    });
    /////dropdown menu stuff///////
    ///////////////////////////////
    self.dropDown = function dropDown(){
      dropdownCounter++;
      if(dropdownCounter%2 == 1){
        $('.dropdownIcon').append(
          "<div class='dropdownContainer'>"+
            "<div class='dropItem' id='dropHome'>Home</div>"+
            // "<div class='dropItem' id='dropAbout'>About</div>"+
            // // "<div class='dropItem' id='dropWhat'>What we do</div>"+
            "<div class='dropItem' id='dropContact'>Contact</div>"+
            "<div class='dropItem' id='dropPrivacy'>Privacy</div>"+
            "<div class='dropItem' id='dropTerms'>Terms</div>"+
            // "<div class='dropItem' id='dropProfile'>Profile</div>"+
            "<div class='dropItem' id='dropSignin'>Sign In</div>"+
            "<div class='dropItem' id='dropLogout'>Logout</div>"+
            "<div class='dropItem' id='dropFacebook'>Facebook</div>"+
            "<div class='dropItem' id='dropTwitter'>Twitter</div>"+
          "</div>"
        );

        $('#dropHome').on('click', function(){
          window.location.hash = "#/"
        });

        $('#dropSignin').on('click', function(){
          var tokenCheck = window.localStorage.sessionToken;
          if(tokenCheck && tokenCheck != "none"){
            window.location.hash = "#/"
          }
          else{
            window.location.hash = "#/signin"
          }
        });

        $('#dropHome').on('mouseenter', function(){
          $('#dropHome').css({
            backgroundColor: "#5A668D"
          });
        });

        $('#dropHome').on('mouseleave', function(){
          $('#dropHome').css({
            backgroundColor: "transparent"
          });
        });

        $('#dropSignin').on('mouseenter', function(){
          $('#dropSignin').css({
            backgroundColor: "#5A668D"
          });
        });

        $('#dropSignin').on('mouseleave', function(){
          $('#dropSignin').css({
            backgroundColor: "transparent"
          });
        });

        // $('#dropAbout').on('click', function(){
        //   window.location.hash = "#/about"
        // });

        $('#dropAbout').on('mouseenter', function(){
          $('#dropAbout').css({
            backgroundColor: "#5A668D"
          });
        });

        $('#dropAbout').on('mouseleave', function(){
          $('#dropAbout').css({
            backgroundColor: "transparent"
          });
        });

        $('#dropProfile').on('mouseenter', function(){
          $('#dropProfile').css({
            backgroundColor: "#5A668D"
          });
        });

        $('#dropProfile').on('mouseleave', function(){
          $('#dropProfile').css({
            backgroundColor: "transparent"
          });
        });

        $('#dropProfile').on('click', function(){
          var currUser = window.localStorage.sessionUser;
          if(currUser && currUser != "none"){
             window.location.hash = "#/users/"+currUser;
          }
        })

        $('#dropFacebook').on('mouseenter', function(){
          $('#dropFacebook').css({
            backgroundColor: "#5A668D"
          });
        });

        $('#dropFacebook').on('mouseleave', function(){
          $('#dropFacebook').css({
            backgroundColor: "transparent"
          });
        });

        $('#dropFacebook').on('click', function(){
          window.open("https://www.facebook.com/WeAreChallengeMaker", target="blank")
        });

        $('#dropTwitter').on('mouseenter', function(){
          $('#dropTwitter').css({
            backgroundColor: "#5A668D"
          });
        });

        $('#dropTwitter').on('mouseleave', function(){
          $('#dropFacebook').css({
            backgroundColor: "transparent"
          });
        });

        $('#dropTwitter').on('click', function(){
          window.open("https://twitter.com/challengemaker1", '_blank')
        });

        $('#dropLogout').on('click', function(){
          self.userSesh = "Sign in";
          window.localStorage.sessionToken = "none"
          window.localStorage.sessionUser = "none"
          window.location.reload()
        });

        $('#dropLogout').on('mouseenter', function(){
          $('#dropLogout').css({
            backgroundColor: "#5A668D"
          });
        });

        $('#dropLogout').on('mouseleave', function(){
          $('#dropLogout').css({
            backgroundColor: "transparent"
          });
        });

        $('#dropContact').on('mouseenter', function(){
          $('#dropContact').css({
            backgroundColor: "#5A668D"
          });
        });

        $('#dropContact').on('mouseleave', function(){
          $('#dropContact').css({
            backgroundColor: "transparent"
          });
        });

        $('#dropContact').on('click', function(){
          window.location.hash = "#/contact"
        });

        $('#dropPrivacy').on('mouseenter', function(){
          $('#dropPrivacy').css({
            backgroundColor: "#5A668D"
          });
        });

        $('#dropPrivacy').on('mouseleave', function(){
          $('#dropPrivacy').css({
            backgroundColor: "transparent"
          });
        });

        $('#dropPrivacy').on('click', function(){
          window.location.hash = "#/privacy"
        });

        $('#dropTerms').on('mouseenter', function(){
          $('#dropTerms').css({
            backgroundColor: "#5A668D"
          });
        });

        $('#dropTerms').on('mouseleave', function(){
          $('#dropTerms').css({
            backgroundColor: "transparent"
          });
        });

        $('#dropTerms').on('click', function(){
          window.location.hash = "#/terms"
        });

        $('.dropdownContainer').on('mouseleave', function(){
          $('.dropdownContainer').remove();
        });

      } else if(dropdownCounter%2 == 0){
        $('.dropdownContainer').remove();
      } else {
        console.log('your dropdown counter is broken');
      }
    }
    // $http.get('/client_token')
    //
    //   .then(function(data){
    //
    //     console.log(data);
    //     self.clientToken = data;
    //     console.log("token", self.clientToken);
    //     console.log(braintree.setup);
    //
    //     braintree.setup(
    //       self.clientToken,
    //       "dropin", {
    //         container: "payment-form"
    //       });
    //
    //   })
////end main controller
///////////////////////
  }
