angular.module('mainController', [])

  .controller('mainCtrl', mainCtrl);

  mainCtrl.$inject = ['$http'];
  function mainCtrl($http){
    var self = this;
    var dropdownCounter = 0;

    var sessionUser = window.localStorage.sessionUser;
    console.log(sessionUser);

    if(localStorage.sessionToken && localStorage.sessionToken!= "false" && localStorage.sessionToken!= "none"){
      self.userSesh = sessionUser;
    }
    else{
      self.userSesh = "Sign in"
    }


    $('.logout').on('click', function(){
      console.log('logging out');
      self.userSesh = "Sign in";
      console.log(self.userSesh);
      window.localStorage.sessionToken = "none"
      window.localStorage.sessionUser = "none"
      console.log(window.localStorage);
      window.location.reload()
    })

    ///make the signin button clickable
    $(".signIn").on("click", function(){
      window.location.hash = "#/signin"
    })

    $(".logo").on('click', function(){
      window.location.hash = "#/"
    })

    $('.signIn').on("mouseenter", function(){
      console.log('moused');
      $(".signIn").css({
        backgroundColor: "#85ADAD"
      })
    })
    $('.signIn').on("mouseleave", function(){
      console.log('moused');
      $(".signIn").css({
        backgroundColor: "transparent"
      })
    })

    /////dropdown menu stuff///////
    ///////////////////////////////
    self.dropDown = function dropDown(){
      dropdownCounter++;
      if(dropdownCounter%2 == 1){
        console.log(dropdownCounter);
        $('.dropdownIcon').append(
          "<div class='dropdownContainer'>"+
            "<div class='dropItem' id='dropHome'>Home</div>"+
            // "<div class='dropItem' id='dropAbout'>About</div>"+
            // // "<div class='dropItem' id='dropWhat'>What we do</div>"+
            // "<div class='dropItem' id='dropContact'>Contact</div>"+
            // "<div class='dropItem' id='dropPrivacy'>Privacy</div>"+
            // "<div class='dropItem' id='dropTerms'>Terms</div>"+
            "<div class='dropItem' id='dropSignup'>Signup</div>"+
            "<div class='dropItem' id='dropLogout'>Logout</div>"+
            "<div class='dropItem' id='dropFacebook'>Facebook</div>"+
            "<div class='dropItem' id='dropTwitter'>Twitter</div>"+
          "</div>"
        )
        $('#dropHome').on('click', function(){
          window.location.hash = "#/"
        });
        $('#dropSignup').on('click', function(){
          window.location.hash = "#/signup"
        });
        $('#dropHome').on('mouseenter', function(){
          $('#dropHome').css({
            backgroundColor: "#5A668D"
          })
        });
        $('#dropHome').on('mouseleave', function(){
          $('#dropHome').css({
            backgroundColor: "transparent"
          })
        });
        $('#dropSignup').on('mouseenter', function(){
          $('#dropSignup').css({
            backgroundColor: "#5A668D"
          })
        });
        $('#dropSignup').on('mouseleave', function(){
          $('#dropSignup').css({
            backgroundColor: "transparent"
          })
        });
        // $('#dropAbout').on('click', function(){
        //   window.location.hash = "#/about"
        // });
        $('#dropAbout').on('mouseenter', function(){
          $('#dropAbout').css({
            backgroundColor: "#5A668D"
          })
        });
        $('#dropAbout').on('mouseleave', function(){
          $('#dropAbout').css({
            backgroundColor: "transparent"
          })
        });
        $('#dropHome').on('click', function(){
          window.location.hash = "#/"
        });
        $('#dropHome').on('mouseenter', function(){
          $('#dropHome').css({
            backgroundColor: "#5A668D"
          })
        });
        $('#dropHome').on('mouseleave', function(){
          $('#dropHome').css({
            backgroundColor: "transparent"
          })
        });
        $('#dropFacebook').on('mouseenter', function(){
          $('#dropFacebook').css({
            backgroundColor: "#5A668D"
          })
        });
        $('#dropFacebook').on('mouseleave', function(){
          $('#dropFacebook').css({
            backgroundColor: "transparent"
          })
        });

        $('#dropFacebook').on('click', function(){
          window.open("https://www.facebook.com/WeAreChallengeMaker", target="blank")
        })

        $('#dropTwitter').on('mouseenter', function(){
          $('#dropTwitter').css({
            backgroundColor: "#5A668D"
          })
        });
        $('#dropTwitter').on('mouseleave', function(){
          $('#dropFacebook').css({
            backgroundColor: "transparent"
          })
        });

        $('#dropTwitter').on('click', function(){
          window.open("https://twitter.com/challengemaker1", '_blank')
        })

        $('#dropLogout').on('click', function(){
          console.log('logging out');
          self.userSesh = "Sign in";
          console.log(self.userSesh);
          window.localStorage.sessionToken = "none"
          window.localStorage.sessionUser = "none"
          console.log(window.localStorage);
          window.location.reload()
        })

        $('#dropLogout').on('mouseenter', function(){
          $('#dropLogout').css({
            backgroundColor: "#5A668D"
          })
        });
        $('#dropLogout').on('mouseleave', function(){
          $('#dropLogout').css({
            backgroundColor: "transparent"
          })
        });

        $('#dropContact').on('mouseenter', function(){
          $('#dropContact').css({
            backgroundColor: "#5A668D"
          })
        });

        $('#dropContact').on('mouseleave', function(){
          $('#dropContact').css({
            backgroundColor: "transparent"
          })
        });

        $('#dropPrivacy').on('mouseenter', function(){
          $('#dropPrivacy').css({
            backgroundColor: "#5A668D"
          })
        });

        $('#dropPrivacy').on('mouseleave', function(){
          $('#dropPrivacy').css({
            backgroundColor: "transparent"
          })
        });

        $('#dropTerms').on('mouseenter', function(){
          $('#dropTerms').css({
            backgroundColor: "#5A668D"
          })
        });

        $('#dropTerms').on('mouseleave', function(){
          $('#dropTerms').css({
            backgroundColor: "transparent"
          })
        });

        $('.dropdownContainer').on('mouseleave', function(){
          $('.dropdownContainer').remove();
        })

        // $('.dropdownIconImage').on('mouseleave', function(){
        //   $('.dropdownContainer').remove();
        // })

      } else if(dropdownCounter%2 == 0){
        console.log(dropdownCounter);
        $('.dropdownContainer').remove();
      } else {
        console.log('your dropdown counter is broken');
      }

    }

    $http.get('/client_token')

      .then(function(data){

        console.log(data);
        self.clientToken = data;
        console.log("token", self.clientToken);
        console.log(braintree.setup);

        braintree.setup(
          self.clientToken,
          "dropin", {
            container: "payment-form"
          });

      })



    /////end dropdown menu//////
    ////////////////////////


  }
