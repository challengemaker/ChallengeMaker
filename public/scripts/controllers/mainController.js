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
          "</div>"
        )
        $('#dropHome').on('click', function(){
          window.location.hash = "#/"
        });
        $('#dropAbout').on('click', function(){
          window.location.hash = "#/about"
        });
        $('#dropHome').on('click', function(){
          window.location.hash = "#/"
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
