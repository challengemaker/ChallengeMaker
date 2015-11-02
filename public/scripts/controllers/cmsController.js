var app = angular.module('cmsController', [])

  .controller('cmsCtrl', cmsCtrl);

  cmsCtrl.$inject = ['$http'];
  function cmsCtrl($http){
    var self = this;

    /////start loading all self.all $http calls, in order to load these first and have them stocked to be available for the toggle switch
    //////get all challenges
    function allChallenges(){
      $http({
        method: "GET"
        ,url: "/api/challenges"
      })
      .then(function(allChallenges){
        self.allChallenges = allChallenges.data;
        self.allMaster = allChallenges.data;
        console.log(self.allChallenges);
      })
    }

    /////load all users
    function allUsers(){
      $http({
        method: "GET"
        ,url: "/api/users"
      })
      .then(function(allUsers){
        self.allUsers = allUsers.data;
        console.log(self.allUsers);
      })
    }

    /////load all Charities
    function allCharities(){
      $http({
        method: "GET"
        ,url: "/api/charities"
      })
      .then(function(allCharities){
        self.allCharities = allCharities.data;
        console.log(self.allCharities);
      })
    }

    //////load all Reponses
    function allResponses(){
      $http({
        method: "GET"
        ,url: "/api/responses"
      })
      .then(function(allResponses){
        console.log(allResponses);
        self.allResponses = allResponses.data;
        console.log(self.allResponses);
      })
    }
    /////////run all functions on-load so that we have our self.alls loaded from the beginning
    function setInitialRepeat(){
      allChallenges();
      allUsers();
      allCharities();
      allResponses();
    }
    setInitialRepeat();
    /////end loading all self.alls on load
    /////////begin logic for toggling self.alls
    //////////////////////////////////////////
    function dropdownLogic(){
      $('.cmsChooseModel').on('change', function(){
        var selectedValue = $(".cmsChooseModel");
        var selectedOption  = selectedValue[0].selectedOptions[0].innerText;
        switch(selectedOption){
          case "Charitie(s)":
            self.allMaster = self.allCharities;
            $('.cmsList').html('')
            for (var i = 0; i < self.allMaster.length; i++) {
              $('.cmsList').append(
                "<div class='cmsItemCharity' id='cmsItemCharity"+i+"'>"+
                  "<h2 class='cmsCharityName'>"+self.allMaster[i].name+"</h2>"+
                  "<button class='cmsShowCharity' id='cmsShowCharity"+i+"'>See Charity Info</button>"+
                  "<button class='cmsEditCharity' id='cmsEditCharity"+i+"'>Update Charity Info</button>"+
                "</div>" +
                "<div class=cmsItemForm"+i+"></div>"
              )
              openShowCharity(i)
              openEditCharity(i)
            }
            break
          case "User(s)":
            self.allMaster = self.allUsers
            $('.cmsList').html('')
            for (var i = 0; i < self.allMaster.length; i++) {
              $('.cmsList').append(
                "<h2>"+self.allMaster[i].name+"</h2>"
              )
            }
            break
          case "Challenge(s)":
            self.allMaster = self.allChallenges
            $('.cmsList').html('')
            for (var i = 0; i < self.allMaster.length; i++) {
              $('.cmsList').append(
                "<div class='cmsItemChallenge' id='cmsItemChallenge"+i+"'>"+
                  "<h2 class='cmsChallengeName'>"+self.allMaster[i].title+"</h2>"+
                  "<button class='cmsShowChallenge' id='cmsShowChallenge"+i+"'>See Challenge Info</button>"+
                  "<button class='cmsEditChallenge' id='cmsEditChallenge"+i+"'>Update Challenge Info</button>"+
                "</div>" +
                "<div class=cmsItemForm"+i+"></div>"
              )
              openShowChallenge(i)
              openEditChallenge(i)
            }
            break
          case "Response(s)":
            self.allMaster = self.allResponses
            $('.cmsList').html('')
            for (var i = 0; i < self.allMaster.length; i++) {
              $('.cmsList').append(
                "<h2>"+self.allMaster[i].challenge+"</h2>" +
                "<h2>"+self.allMaster[i].creator+"</h2>"
              )
            }
            break
        }
      })
    }
    dropdownLogic();


    //////function to add the event to open show/edit window, which will be called in switch
    ///////////create show/edit for charities
    self.showCharityCounter = true
    function openShowCharity(x){
      $("#cmsShowCharity"+x).on('click', function(){
        if(self.showCharityCounter){
          $('.cmsItemForm'+x).append(
            "<div id='showCharityBox'"+x+">"+
              "<h1>showing some charity info we is</h1>"+
            "</div>"
          )
          self.showCharityCounter = !self.showCharityCounter
        } else if(!self.showCharityCounter){
            $('.cmsItemForm'+x).html('')
            self.showCharityCounter = !self.showCharityCounter
        }
      })
    }
    self.editCharityCounter = true
    function openEditCharity(x){
      $("#cmsEditCharity"+x).on('click', function(){
        if(self.editCharityCounter){
          $('.cmsItemForm'+x).append(
            "<div id='editCharityBox'"+x+">"+
              "<h1>showing some charity info we is</h1>"+
            "</div>"
          )
          self.editCharityCounter = !self.editCharityCounter
        } else if(!self.editCharityCounter){
            $('.cmsItemForm'+x).html('')
            self.editCharityCounter = !self.editCharityCounter
        }
      })
    }

    //////create show/edit framework for challenges
    self.showChallengeCounter = true
    function openShowChallenge(x){
      $("#cmsShowChallenge"+x).on('click', function(){
        if(self.showChallengeCounter){
          $('.cmsItemForm'+x).append(
            "<div id='showChallengeBox'"+x+">"+
              "<h1>showing some challenge info we is</h1>"+
            "</div>"
          )
          self.showChallengeCounter = !self.showChallengeCounter
        } else if(!self.showChallengeCounter){
            $('.cmsItemForm'+x).html('')
            self.showChallengeCounter = !self.showChallengeCounter
        }
      })
    }
    self.editChallengeCounter = true
    function openEditChallenge(x){
      $("#cmsEditChallenge"+x).on('click', function(){
        if(self.editChallengeCounter){
          $('.cmsItemForm'+x).append(
            "<div id='editChallengeBox'"+x+">"+
              "<h1>showing some challenge info we is</h1>"+
            "</div>"
          )
          self.editChallengeCounter = !self.editChallengeCounter
        } else if(!self.editChallengeCounter){
            $('.cmsItemForm'+x).html('')
            self.editChallengeCounter = !self.editChallengeCounter
        }
      })
    }

    ////////begin events related to non-all $http loads
    /////////////////////////////////
    ////////////challenges //////////

    //////show a single Challenge
    // $('.submitCms').on('click', function(){
    //   $http({
    //     method: "GET"
    //     ,url: "/api/challenges/Pie-in-the-Face-Challenge"
    //   })
    //   .then(function(err, singleChallenge){
    //     if(err){console.log(err)}
    //     console.log(singleChallenge);
    //   })
    // })

    // Find One Challenge
    // $('.submitCms').on('click', function(){
    //   $http({
    //     method: "POST"
    //     ,url: "/api/challenges"
    //     ,data: {title: , sponsor: "Jimmy Dean"}
    //   })
    //   .then(function(data){
    //     console.log(data);
    //   })
    // })

    // Update One Challenge
    // $('.submitCms').on('click', function(){
    //   $http({
    //     method: "POST"
    //     ,url: "/api/challenges/update"
    //     ,data: {search: {title: "Drought Bucket Challenge2"}, title: "Drought Bucket Challenge"}
    //   })
    //   .then(function(data){
    //     console.log(data);
    //   })
    // })

    // Delete ONe Challenge
    // $('.submitCms').on('click', function(){
    //   $http({
    //     method: "DELETE"
    //     ,url: "/api/challenges/Jack's-Jumping-Challenge"
    //   })
    //   .then(function(data){
    //     console.log(data);
    //   })
    // })




    // $http({
    //   method: "GET",
    //   url: "/api/challengefriends"
    // })
    // .then(function(data){
    //   console.log(data);
    //   var allFriendsChallenges = data.data;
    //   console.log(allFriendsChallenges);
    //   for (var i = 0; i < allFriendsChallenges.length; i++) {
    //     allFriendsChallenges[i].challengeUrlToSend = "https://challengemaker.herokuapp.com/#/youvebeenchallenged/"+allFriendsChallenges[i].challenge + "/" + allFriendsChallenges[i].friendVideoUrl.split('/')[4] + "/" + allFriendsChallenges[i].senderName.split(' ').join('-');
    //     console.log(allFriendsChallenges[i]);
    //   }
    //   self.allFriendsChallenges = allFriendsChallenges
    // })

    /////check password
    // $('.pwChecker').on('click', function(){
    //   var attempt = $('.pwAttempt').val();
    //   console.log(attempt);
    //   $http({
    //     method: "POST"
    //     ,url: "/api/password"
    //     ,data: {password: attempt}
    //   })
    //   .then(function(data){
    //     console.log(data);
    //     self.passwordCorrect = data.data.valid;
    //     if(self.passwordCorrect){
    //       $('.passwordBox').html('')
    //     }
    //   })
    // })
    // ///keypress event
    // $('.pwAttempt').keypress(function(evt){
    //   console.log(evt);
    //   var attempt = $('.pwAttempt').val();
    //   console.log(attempt);
    //   $http({
    //     method: "POST"
    //     ,url: "/api/password"
    //     ,data: {password: attempt}
    //   })
    //   .then(function(data){
    //     console.log(data);
    //     self.passwordCorrect = data.data.valid;
    //     if(self.passwordCorrect){
    //       $('.passwordBox').html('')
    //     }
    //   })
    // })



    //////////end controller
  }
