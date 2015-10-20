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

    /////dropdown menu stuff///////
    ///////////////////////////////
    self.dropDown = function dropDown(){
      dropdownCounter++;
      if(dropdownCounter%2 == 1){
        console.log(dropdownCounter);
        $('.dropdownIcon').append(
          "<div class='dropdownContainer'>"+
            "<div class='dropItem' id='dropHome'>Home</div>"+
            "<div class='dropItem' id='dropAbout'>About</div>"+
            "<div class='dropItem' id='dropWhat'>What we do</div>"+
            "<div class='dropItem' id='dropHelp'>Help</div>"+
            "<div class='dropItem' id='dropFaq'>Faq</div>"+
            "<div class='dropItem' id='dropTerms'>Terms</div>"+
            "<div class='dropItem' id='dropLogout'>Logout</div>"+
          "</div>"
        )
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
        $('#dropAbout').on('click', function(){
          window.location.hash = "#/about"
        });
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
        $('#dropWhat').on('mouseenter', function(){
          $('#dropWhat').css({
            backgroundColor: "#5A668D"
          })
        });
        $('#dropWhat').on('mouseleave', function(){
          $('#dropWhat').css({
            backgroundColor: "transparent"
          })
        });
        $('#dropHelp').on('mouseenter', function(){
          $('#dropHelp').css({
            backgroundColor: "#5A668D"
          })
        });
        $('#dropHelp').on('mouseleave', function(){
          $('#dropHelp').css({
            backgroundColor: "transparent"
          })
        });
        $('#dropFaq').on('mouseenter', function(){
          $('#dropFaq').css({
            backgroundColor: "#5A668D"
          })
        });
        $('#dropFaq').on('mouseleave', function(){
          $('#dropFaq').css({
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

      } else if(dropdownCounter%2 == 0){
        console.log(dropdownCounter);
        $('.dropdownContainer').remove();
      } else {
        console.log('your dropdown counter is broken');
      }

    }



    /////end dropdown menu//////
    ////////////////////////


  }
