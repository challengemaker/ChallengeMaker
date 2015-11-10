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
        self.allChallenges = allChallenges.data.reverse()
        self.allMaster = allChallenges.data.reverse()
      })
    }

    /////load all users
    function allUsers(){
      $http({
        method: "GET"
        ,url: "/api/users"
      })
      .then(function(allUsers){
        self.allUsers = allUsers.data.reverse()
      })
    }

    /////load all Charities
    function allCharities(){
      $http({
        method: "GET"
        ,url: "/api/charities"
      })
      .then(function(allCharities){
        self.allCharities = allCharities.data.reverse()
      })
    }

    //////load all Reponses
    function allResponses(){
      $http({
        method: "GET"
        ,url: "/api/responses"
      })
      .then(function(allResponses){
        self.allResponses = allResponses.data.reverse()
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
            $('.cmsAddCreate').css({
              opacity: 1
            })
            for (var i = 0; i < self.allMaster.length; i++) {
              $('.cmsList').append(
                "<div class='cmsItemCharity' id='cmsItemCharity"+i+"'>"+
                  "<h2 class='cmsCharityName'>"+self.allMaster[i].name+"</h2>"+
                  "<button class='repeatButton cmsShowCharity' id='cmsShowCharity"+i+"'>See Charity Info</button>"+
                  "<button class='repeatButton cmsEditCharity' id='cmsEditCharity"+i+"'>Update Charity Info</button>"+
                  "<button class='repeatButton cmsDeleteCharity' id='cmsDeleteCharity"+i+"'>Delete Charity Info</button>"+
                "</div>" +
                "<div class=cmsItemForm"+i+"></div>"
              )
              openShowCharity(i)
              openEditCharity(i)
              deleteCharity(i)
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
            $('.cmsAddCreate').css({
              opacity: .4
            })
            for (var i = 0; i < self.allMaster.length; i++) {
              $('.cmsList').append(
                "<div class='cmsItemUser' id='cmsItemUser"+i+"'>"+
                  "<h2 class='cmsUserName'>"+self.allMaster[i].name+"</h2>"+
                  "<button class='repeatButton cmsShowUser' id='cmsShowUser"+i+"'>See User Info</button>"+
                  "<button class='repeatButton cmsEditUser' id='cmsEditUser"+i+"'>Update User Info</button>"+
                  "<button class='repeatButton cmsDeleteUser' id='cmsDeleteUser"+i+"'>Delete User</button>"+
                "</div>" +
                "<div class=cmsItemForm"+i+"></div>"
              )
              openShowUser(i)
              openEditUser(i)
              deleteUser(i)
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
            $('.cmsAddCreate').css({
              opacity: 1
            })
            for (var i = 0; i < self.allMaster.length; i++) {
              $('.cmsList').append(
                "<div class='cmsItemChallenge' id='cmsItemChallenge"+i+"'>"+
                  "<h2 class='cmsChallengeName'>"+self.allMaster[i].title+"</h2>"+
                  "<button class='repeatButton cmsShowChallenge' id='cmsShowChallenge"+i+"'>See Challenge Info</button>"+
                  "<button class='repeatButton cmsEditChallenge' id='cmsEditChallenge"+i+"'>Update Challenge Info</button>"+
                  "<button class='repeatButton cmsDeleteChallenge' id='cmsDeleteChallenge"+i+"'>Delete Challenge Info</button>"+
                "</div>" +
                "<div class=cmsItemForm"+i+"></div>"
              )
              openShowChallenge(i)
              openEditChallenge(i)
              deleteChallenge(i)
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
            $('.cmsAddCreate').css({
              opacity: .4
            })
            for (var i = 0; i < self.allMaster.length; i++) {
              $('.cmsList').append(
                "<div class='cmsItemResponse' id='cmsItemResponse"+i+"'>"+
                  "<h2 class='cmsResponseName'>"+self.allMaster[i].challenge.split('-').join(' ')+"</h2>"+
                  "<button class='repeatButton cmsShowResponse' id='cmsShowResponse"+i+"'>See Response Info</button>"+
                  "<button class='repeatButton cmsEditResponse' id='cmsEditResponse"+i+"'>Update Response Info</button>"+
                  "<button class='repeatButton cmsDeleteResponse' id='cmsDeleteResponse"+i+"'>Delete Response Info</button>"+
                "</div>" +
                "<div class=cmsItemForm"+i+"></div>"
              )
              openShowResponse(i)
              openEditResponse(i)
              deleteResponse(i)
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
    /////////end the logic for creating the dropdown
    ////////////////////////////////////////////////

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
        var thisCharity = self.allCharities[x]
        console.log(thisCharity);
        if(self.editCharityCounter){
          $('.cmsItemForm'+x).append(
            "<div class='cmsEditCharity'>"+
              "<h2>Create a New Charity</h2>"+
              "<input class='editCharityName' type='text' value='"+thisCharity.name+"'>"+
              "<input class='editCharityDescription' type='text' value='"+thisCharity.description+"'>"+
              "<input class='editCharityPhoto' type='text' value='"+thisCharity.photo+"'>"+
              "<input class='editCharityUrl' type='text' value='"+thisCharity.url+"'>"+
              "<input class='cmsSubmitEditCharity' id='cmsSubmitEditCharity"+x+"' type='submit' value='Update Charity Info'>"+
            "</div>"
          )
          editCharity(x)
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
              "<div id='showResponsePhoto'><img src='https://img.youtube.com/vi/"+self.allResponses[x].videoUrl+"/0.jpg'>"+
              "</div>"+
              "<div id='showResponseInfo1'>"+
                "<h4> Creator: "+self.allResponses[x].creator+ "</h4>"+
                "<h4> YouTube Link: "+self.allResponses[x].videoUrl+ "</h4>"+
                "<h4> ResponseId: "+self.allResponses[x]._id+ "</h4>"+
              "</div>"+
              // "<div id='showResponseInfo2'>"+
              "</div>"+
            "</div>"
          )
          //"https://img.youtube.com/vi/"+self.challengerVideoId+"/0.jpg"
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
          //////serial counter starts at negative one and counts backwards, and fills in the role of "i" for the repeat-created list
          self.createNewCounter = !self.createNewCounter
          var i = self.allChallenges.length - 1;
          //////now, to make the page totally dynamic, we prepend it to the cmsList
          $('.cmsList').prepend(
            "<div class='cmsItemChallenge' id='cmsItemChallenge"+i+"'>"+
              "<h2 class='cmsChallengeName'>"+data.data.title+"</h2>"+
              "<button class='repeatButton cmsShowChallenge' id='cmsShowChallenge"+i+"'>See Challenge Info</button>"+
              "<button class='repeatButton cmsEditChallenge' id='cmsEditChallenge"+i+"'>Update Challenge Info</button>"+
              "<button class='repeatButton cmsDeleteChallenge' id='cmsDeleteChallenge"+i+"'>Delete Challenge Info</button>"+
            "</div>" +
            "<div class=cmsItemForm"+i+"></div>"
          )
          openShowChallenge(i)
          openEditChallenge(i)
          deleteChallenge(i)
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
          self.allMaster.push(data.data)
          self.allCharities.push(data.data)
          //////serial counter starts at negative one and counts backwards, and fills in the role of "i" for the repeat-created list
          self.createNewCounter = !self.createNewCounter
          // if(self.serialCharityCounter){
          //   self.serialCharityCounter -= self.serialCharityCounter
          //   var i = self.serialCharityCounter
          //   console.log(self.serialCharityCounter);
          // } else {
          //   self.serialCharityCounter = -1
          //   var i = self.serialCharityCounter
          // }

          var i = self.allCharities.length - 1;
          console.log(i);
          console.log(data.data);
          //////now, to make the page totally dynamic, we prepend it to the cmsList
          $('.cmsList').prepend(
            "<div class='cmsItemCharity' id='cmsItemCharity"+i+"'>"+
              "<h2 class='cmsCharityName'>"+data.data.name+"</h2>"+
              "<button class='repeatButton cmsShowCharity' id='cmsShowCharity"+i+"'>See Charity Info</button>"+
              "<button class='repeatButton cmsEditCharity' id='cmsEditCharity"+i+"'>Update Charity Info</button>"+
              "<button class='repeatButton cmsDeleteCharity' id='cmsDeleteCharity"+i+"'>Delete Charity Info</button>"+
            "</div>" +
            "<div class=cmsItemForm"+i+"></div>"
          )
          openShowCharity(i)
          openEditCharity(i)
          deleteCharity(i)
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

    ///////////Begin creating All Delete Functions
    /////////////////////////////////////////////
    function deleteChallenge(x){
      $('#cmsDeleteChallenge'+x).on('click', function(){
        var thisName = self.allChallenges[x].title.split(" ").join('-')

        console.log(thisName);
        $http({
          method: "DELETE"
          ,url: "/api/challenges/"+thisName
        })
        .then(function(data){
          console.log(data);
          console.log($('#cmsItemChallenge'+x));
          $('#cmsItemChallenge'+x).animate({
            height: "0px"
          }, 150)
          setTimeout(function(){
            $('#cmsItemChallenge'+x).remove()
          }, 150)

        })
      })
    }

    ///////delete a Charity
    function deleteCharity(x){
      $('#cmsDeleteCharity'+x).on('click', function(){
        var thisName = self.allCharities[x].name
        $http({
          method: "DELETE"
          ,url: "/api/charities/"+thisName
        })
        .then(function(data){
          $('#cmsItemCharity'+x).animate({
            height: "0px"
          }, 150)
          setTimeout(function(){
            $('#cmsItemCharity'+x).remove()
          }, 150)
          self.allCharities.pop()
        })
      })
    }

    ///////delete a User
    function deleteUser(x){
      $('#cmsDeleteUser'+x).on('click', function(){
        var thisUserId = self.allUsers[x]._id
        $http({
          method: "DELETE"
          ,url: "/api/users/"+thisUserId
        })
        .then(function(data){
          $('#cmsItemUser'+x).animate({
            height: "0px"
          }, 150)
          setTimeout(function(){
            $('#cmsItemUser'+x).remove()
          }, 150)
          self.allUsers.pop()
        })
      })
    }

    ///////delete a Response
    function deleteResponse(x){
      $('#cmsDeleteResponse'+x).on('click', function(){
        var thisResponseId = self.allResponses[x]._id
        console.log(thisResponseId)
        $http({
          method: "DELETE"
          ,url: "/api/responses/"+thisResponseId
        })
        .then(function(data){
          $('#cmsItemResponse'+x).animate({
            height: "0px"
          }, 150)
          setTimeout(function(){
            $('#cmsItemResponse'+x).remove()
          }, 150)
          self.allResponses.pop()
        })
      })
    }
    ///////////////////////end all delete//////
    ///////////////////////////////////////////

    ///////////////////////Begin all update/edits/////
    //////////////////////////////////////////////////
    function editCharity(x){
      var thisId = self.allCharities[x]._id
      $("#cmsSubmitEditCharity"+x).on('click', function(evt){
        console.log('hey there');
        console.log(evt);
        var newName = $('.editCharityName').val()
        var newDescription = $('.editCharityDescription').val()
        var newPhoto = $('.editCharityPhoto').val()
        var newUrl = $('.editCharityUrl').val()
        console.log(newName);
        console.log(newDescription);
        console.log(newPhoto);
        console.log(newUrl);
        search = {_id: thisId}
        $http({
          method: "POST"
          ,url: "/api/charities/update"
          ,data: {search: {name: newName}, description: newDescription, photo: newPhoto, url: newUrl}
        })
        .then(function(data){
          console.log('yooyoyoyoyoy');
          console.log(data);
          $('.cmsCharityName').text(data.data.name)
        })
      })
    }
    //////////end controller
  }
