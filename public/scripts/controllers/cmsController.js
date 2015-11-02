var app = angular.module('cmsController', [])

  .controller('cmsCtrl', cmsCtrl);

  cmsCtrl.$inject = ['$http'];
  function cmsCtrl($http){
    var self = this

    /////start loading all self.all $http calls, in order to load these first and have them stocked to be available for the toggle switch
    //////get all challenges
    function allChallenges(){
      $http({
        method: "GET"
        ,url: "/api/challenges"
      })
      .then(function(allChallenges){
        self.allChallenges = allChallenges.data
        self.allMaster = allChallenges.data
      })
    }

    /////load all users
    function allUsers(){
      $http({
        method: "GET"
        ,url: "/api/users"
      })
      .then(function(allUsers){
        self.allUsers = allUsers.data
      })
    }

    /////load all Charities
    function allCharities(){
      $http({
        method: "GET"
        ,url: "/api/charities"
      })
      .then(function(allCharities){
        self.allCharities = allCharities.data
      })
    }

    //////load all Reponses
    function allResponses(){
      $http({
        method: "GET"
        ,url: "/api/responses"
      })
      .then(function(allResponses){
        self.allResponses = allResponses.data
      })
    }
    /////////run all functions on-load so that we have our self.alls loaded from the beginning
    function setInitialRepeat(){
      allChallenges()
      allUsers()
      allCharities()
      allResponses()
    }
    setInitialRepeat()
    /////end loading all self.alls on load
    /////////begin logic for toggling self.alls
    //////////////////////////////////////////
    function dropdownLogic(){
      $('.cmsChooseModel').on('change', function(){
        var selectedValue = $(".cmsChooseModel")
        var selectedOption  = selectedValue[0].selectedOptions[0].innerText
        switch(selectedOption){
          case "Charitie(s)":
            self.allMaster = self.allCharities
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
            $('.cmsCreateNewContainer').animate({
              height: '0px'
            }, 200)
            if (!self.createNewCounter) {
              self.createNewCounter = !self.createNewCounter
            }
            $('.cmsCreateNewContainer').html('')
            $('.cmsCreateNewContainer').append(
              "<div class='cmsCreateNewCharity'>"+
                "<h2>Create a New Charity</h2>"+
                "<input class='newCharityName' type='text' placeholder='Charity Name'>"+
                "<input class='newCharityDescription' type='text' placeholder='Charity description'>"+
                "<input class='newCharityPhoto' type='text' placeholder='Charity video link'>"+
                "<input class='newCharityUrl' type='text' placeholder='Charity website link'>"+
                "<input class='cmsSubmitNewCharity' type='submit' value='Create New Charity'>"+
              "</div>"
            )
            createNewCharity()
            break
          case "User(s)":
            self.allMaster = self.allUsers
            $('.cmsList').html('')
            for (var i = 0; i < self.allMaster.length; i++) {
              $('.cmsList').append(
                "<div class='cmsItemUser' id='cmsItemUser"+i+"'>"+
                  "<h2 class='cmsUserName'>"+self.allMaster[i].name+"</h2>"+
                  "<button class='cmsShowUser' id='cmsShowUser"+i+"'>See User Info</button>"+
                  "<button class='cmsEditUser' id='cmsEditUser"+i+"'>Update User Info</button>"+
                "</div>" +
                "<div class=cmsItemForm"+i+"></div>"
              )
              openShowUser(i)
              openEditUser(i)
            }
            $('.cmsCreateNewContainer').animate({
              height: '0px'
            }, 200)
            if (!self.createNewCounter) {
              self.createNewCounter = !self.createNewCounter
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
            $('.cmsCreateNewContainer').animate({
              height: '0px'
            }, 200)
            if (!self.createNewCounter) {
              self.createNewCounter = !self.createNewCounter
            }
            $('.cmsCreateNewContainer').html('')
            $('.cmsCreateNewContainer').append(
              "<div class='cmsCreateNewChallenge'>"+
                "<h2>Create a New Challenge</h2>"+
                "<input class='newChallengeTitle' type='text' placeholder='challenge title'>"+
                "<input class='newChallengeDescription' type='text' placeholder='challenge description'>"+
                "<input class='newChallengeVideo' type='text' placeholder='challenge video link'>"+
                "<input class='newChallengeCharity' type='text' placeholder='charity name'>"+
                "<input class='cmsSubmitNewChallenge' type='submit' value='Create New Challenge'>"+
              "</div>"
            )
            createNewChallenge()
            //////create new challenge post request goes here
            break
          case "Response(s)":
            self.allMaster = self.allResponses
            $('.cmsList').html('')
            for (var i = 0; i < self.allMaster.length; i++) {
              $('.cmsList').append(
                "<div class='cmsItemResponse' id='cmsItemResponse"+i+"'>"+
                  "<h2 class='cmsResponseName'>"+self.allMaster[i].challenge+"</h2>"+
                  "<button class='cmsShowResponse' id='cmsShowResponse"+i+"'>See Response Info</button>"+
                  "<button class='cmsEditResponse' id='cmsEditResponse"+i+"'>Update Response Info</button>"+
                "</div>" +
                "<div class=cmsItemForm"+i+"></div>"
              )
              openShowResponse(i)
              openEditResponse(i)
            }
            $('.cmsCreateNewContainer').animate({
              height: '0px'
            }, 200)
            if (!self.createNewCounter) {
              self.createNewCounter = !self.createNewCounter
            }
            break
        }
      })
    }
    dropdownLogic()


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

    //////create show/edit framework for Responses
    self.showResponseCounter = true
    function openShowResponse(x){
      $("#cmsShowResponse"+x).on('click', function(){
        if(self.showResponseCounter){
          $('.cmsItemForm'+x).append(
            "<div id='showResponseBox'"+x+">"+
              "<h1>showing some Response info we is</h1>"+
            "</div>"
          )
          self.showResponseCounter = !self.showResponseCounter
        } else if(!self.showResponseCounter){
            $('.cmsItemForm'+x).html('')
            self.showResponseCounter = !self.showResponseCounter
        }
      })
    }
    self.editResponseCounter = true
    function openEditResponse(x){
      $("#cmsEditResponse"+x).on('click', function(){
        if(self.editResponseCounter){
          $('.cmsItemForm'+x).append(
            "<div id='editResponseBox'"+x+">"+
              "<h1>showing some Response info we is</h1>"+
            "</div>"
          )
          self.editResponseCounter = !self.editResponseCounter
        } else if(!self.editResponseCounter){
            $('.cmsItemForm'+x).html('')
            self.editResponseCounter = !self.editResponseCounter
        }
      })
    }

    //////create show/edit framework for Users
    self.showUserCounter = true
    function openShowUser(x){
      $("#cmsShowUser"+x).on('click', function(){
        if(self.showUserCounter){
          $('.cmsItemForm'+x).append(
            "<div id='showUserBox'"+x+">"+
              "<h1>showing some User info we is</h1>"+
            "</div>"
          )
          self.showUserCounter = !self.showUserCounter
        } else if(!self.showUserCounter){
            $('.cmsItemForm'+x).html('')
            self.showUserCounter = !self.showUserCounter
        }
      })
    }
    self.editUserCounter = true
    function openEditUser(x){
      $("#cmsEditUser"+x).on('click', function(){
        if(self.editUserCounter){
          $('.cmsItemForm'+x).append(
            "<div id='editUserBox'"+x+">"+
              "<h1>showing some User info we is</h1>"+
            "</div>"
          )
          self.editUserCounter = !self.editUserCounter
        } else if(!self.editUserCounter){
            $('.cmsItemForm'+x).html('')
            self.editUserCounter = !self.editUserCounter
        }
      })
    }
    ///////////////Finish List Creation and Dropdown Functionality
    ////////////////////////////////////

    //////Begin Logic to add a "Create" Functionality at the top of the list
    ///////////////////////////////////////////////
    self.createNewCounter = true
    function cmsCreateNew(){
      $('.cmsAddCreate').on('click', function(){
        /////empty out any old values that might be in there
        if ($('.newChallengeTitle')) {
          $('.newChallengeTitle').val('')
        }
        if ($('.newChallengeTitle')) {
          $('.newChallengeDescription').val('')
        }
        if ($('.newChallengeTitle')) {
          $('.newChallengeVideo').val('')
        }
        if ($('.newChallengeTitle')) {
          $('.newChallengeCharity').val('')
        }
        if ($('.newCharityName')) {
          $('.newCharityName').val('')
        }
        if ($('.newCharityDescription')) {
          $('.newCharityDescription').val('')
        }
        if ($('.newCharityPhoto')) {
          $('.newCharityPhoto').val('')
        }
        if ($('.newCharityUrl')) {
          $('.newCharityUrl').val('')
        }
        if(self.createNewCounter){
          if (self.allMaster[0] == self.allChallenges[0] || self.allMaster[0] == self.allCharities[0]) {
            console.log('on challenges or charities');
            $('.cmsCreateNewContainer').animate({
              height: "300px"
            }, 200)
            self.createNewCounter = !self.createNewCounter
          } else {
            console.log('sorry you cant create a new one of those, not a challenge or charity');
          }
        } else {
          if (!self.createNewCounter) {
            $('.cmsCreateNewContainer').animate({
              height: "0px"
            }, 200)
            self.createNewCounter = !self.createNewCounter
          }
        }
      })
    }
    cmsCreateNew()


    //////////////End CMS Create Functionality//////
    ////////////////////////////////////////////////

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

    // Post One Challenge
    function createNewChallenge(){
      $('.cmsSubmitNewChallenge').on('click', function(){
        //////now input new values
        var title = $('.newChallengeTitle').val()
        var description = $('.newChallengeDescription').val()
        var video = $('.newChallengeVideo').val()
        var charity = $('.newChallengeCharity').val()
        $http({
          method: "POST"
          ,url: "/api/challenges"
          ,data: {title: title, description: description, videoUrl: video, charity: charity}
        })
        .then(function(data){
          console.log(data);
          $('.cmsCreateNewContainer').animate({
            height: "0px"
          })
          self.createNewCounter = !self.createNewCounter
        })
      })
    }

    ///post one Charity
    function createNewCharity(){
      //////now input new values
      $(".cmsSubmitNewCharity").on('click', function(){
        console.log('lets make a new charity!');
        var name = $('.newCharityName').val()
        var description = $('.newCharityDescription').val()
        var video = $('.newCharityPhoto').val()
        var siteUrl = $('.newCharityUrl').val()
        $http({
          method: "POST"
          ,url: "/api/charities"
          ,data: {name: name, description: description, video: video, url: siteUrl}
        })
        .then(function(data){
          console.log(data);
          $('.cmsCreateNewContainer').animate({
            height: "0px"
          })
          self.createNewCounter = !self.createNewCounter
        })
      })
    }

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
