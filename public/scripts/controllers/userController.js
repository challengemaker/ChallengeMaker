angular.module('userController', [])

  .controller('userCtrl', userCtrl)

  .factory('userFactory', userFactory)

  function userFactory(){
    return {id: 'yea ya'}
  }

  userCtrl.$inject = ['$http', 'userFactory'];
  function userCtrl($http, userFactory){
    var self = this;

    console.log(userFactory);

    $('.goToSignup').on("click", function(){
      window.location.hash = "#/signup"
    })

    $('.goToSignupChallenge').on("click", function(){
      window.location.hash = "#/signup/"+window.location.hash.split("/")[2];
    })

    $('.goToLogin').on("click", function(){
      window.location.hash = "#/signin"
    })

    $('.goToLoginChallenge').on("click", function(){
      window.location.hash = "#/signin/"+window.location.hash.split('/')[2]
    })
    //////begin profile section
    ///////////////////////////
    ///////////////////////////
    if(window.location.hash.split('/')[1] == "users"){
      var thisUser = window.location.hash.split("/")[2].split("-").join(' ');
      console.log(thisUser);
      $http({
        method: "GET"
        ,url: "/api/users/"+thisUser
      })
      .then(function(data){
        console.log(data);
        self.thisUserEmail = data.data.user.email;
        self.thisUserData = data.data.user;
        console.log(self.thisUserEmail);
      })
      console.log(thisUser);
      self.thisUser = thisUser

      ////create editor popup thingy
      self.profileCounter = true;
      self.profileEmailCounter = true;
      self.profilePasswordCounter = true;

      /////////to edit a users profile name
      function editProfile(){
        var currentName = $('#username').text();
        $('#nameEditor').html("");
        $('#nameEditor').html(
          "<input id='usernameEdit' type='text' value='"+currentName+"'>"
        );
        self.profileCounter = !self.profileCounter;
        console.log(self.profileCounter);
        addEventListener();
      }

      //////////to edit a users email
      function editEmail(){
        var currentEmail = $('#useremail').text();
        $('#emailEditor').html('');
        $('#emailEditor').html(
        "<input id='useremailEdit' type='text' value='"+currentEmail+"'>"
        )
        self.profileEmailCounter = !self.profileEmailCounter;
        addEventListener()
      }
      function editPassword(){
        $('#passwordEditor').html('');
        $('#passwordEditor').html(
        "<input id='userpasswordEdit' type='text' placeholder='old password here'>" +
        "<input id='userpasswordConfirmEdit' type='text' placeholder='new password here'>"
        )
        self.profilePasswordCounter = !self.profilePasswordCounter;
        addEventListener()
      }

      /////set the value
      function saveEdits(){
        var oldName = self.thisUser;
        var newName = $('#usernameEdit').val();
        $('#nameEditor').html("");
        $('#nameEditor').html(
          "<td id='username'>"+newName+"</td>"
        );
        $('#username').on('click', editProfile)
        self.profileCounter = !self.profileCounter;
        ///set up and send the http request to the db
        var request = {search: {name: oldName}, name: newName}
        $http({
          method: "POST"
          ,url: "/api/users/update"
          ,data: request
        })
        .then(function(){
          console.log(newName);
          window.localStorage.sessionUser = newName;
          var newUrlName = newName.split(' ').join("-");
          window.location.hash = "#/users/"+newUrlName;
          window.location.reload();
        })
      }

      function saveEmailEdits(){
        var oldEmail = self.thisUserEmail;
        console.log(oldEmail);
        var newEmail = $('#useremailEdit').val();
        console.log(newEmail);
        $('#emailEditor').html(
          "<td id='useremail'>"+newEmail+"</td>"
        )
        $('#useremail').on('click', editEmail);
        self.profileEmailCounter = !self.emailProfileCounter;
        console.log(self.profileEmailCounter);
        var emailRequest = {search: {email: oldEmail}, email: newEmail}
        $http({
          method: "POST"
          ,url: "/api/users/update"
          ,data: emailRequest
        })
        .then(function(data){
          console.log(data);
          window.location.reload();
        })
      }

      function savePasswordEdits(){
        var oldPassword = $("#userpasswordEdit").val();
        var newPassword = $("#userpasswordConfirmEdit").val();
        var name = window.location.hash.split('/')[2];
        console.log(name);
        console.log(oldPassword);
        console.log(newPassword);
        $http({
          method: "POST"
          ,url: "/api/users/updatepassword"
          ,data: {name: name, oldPassword: oldPassword, newPassword}
        })
        .then(function(err, data){
          if(err){console.log(err)};
          console.log(data);
          if(data.notValid){
            console.log('not a valid passowrd');
          } else {
            console.log('password valid');
            $('#userpasswordConfirmEdit').css({
              backgroundColor: "red"
            })
            $('#userpasswordConfirmEdit').animate({
              backgroundColor: "white"
            }, 1000)
            window.location.reload();
          }
        })
      }

      // if(self.profileCounter == true){
      $('#username').on('click', editProfile)
      $('#useremail').on('click', editEmail)
      $('#userpassword').on('click', editPassword)
      // }{
      /////we put an if statement around each piece, so that the counter only works if it's been clicked (using our self. counters)
      // self.profileCounter = true;
      // self.profileEmailCounter = true;
      // self.profilePasswordCounter = true;
      function addEventListener(){
        if(!self.profileCounter){
          $('#profileImage').on('click', saveEdits);
        }
        else if(!self.profileEmailCounter){
          $('#profileImage').on('click', saveEmailEdits);
        }
        else if(!self.profilePasswordCounter){
          $('#profileImage').on('click', savePasswordEdits);
        }
      }
      // }
    }
    /////////end profile section ///////////
    ////////////////////////////////////////
    ////////////////////////////////////////

    ///using if statement to determine if we're looking at an "all users" list or single user's profile page
    if(window.location.hash.split('/')[1] == "signup"){
      console.log('yo');
      $(".submitNew").on('click', submitNew);
      function submitNew(){
        console.log('hi');
        self.name = $('.signupName').val();
        console.log(name);
        var email = $('.signupEmail').val();
        console.log(email);
        var password = $('.signupPw').val();
        console.log(password);
        var newUser = {name: name, email: email, password: password, local: {email: email}}
        $http({
          data: newUser,
          method: 'POST',
          url: '/signup'
        })
        .then(function(data){
          var name = self.name;
          console.log(name);
          console.log(data);
          var email = data.data.email;
          console.log(email);
          var password = data.data.password;
          console.log(password);
          // var newUser =
          $http({
            data: {name: name, email: email, password: password, local: {email: email}},
            method: "POST",
            url: "/api/users"
            })
            .then(function(moreData){
              console.log(moreData);
              var email = moreData.data.email;
              console.log(email);
              var password = moreData.data.password;
              console.log(password);
              $http({
                data: {email: email, password: password},
                method: 'POST',
                url: '/login'
              })
              .then(function(data){
                console.log(data);
                window.localStorage.sessionToken = data.data.token;
                window.localStorage.sessionUser = data.data.user.name;
                self.userSesh = window.localStorage.sessionUser;
                var responseUrl = window.location.hash.split('/')[2];
                console.log(responseUrl);
                if(responseUrl){
                  window.location.hash = "#/newresponse/"+responseUrl;
                  window.location.reload();
                }
                else{
                  window.location.hash = "#/"
                  window.location.reload();
                }
              })
              // window.location.hash = "/profile";
            })
          })
        }
      }

    if (window.location.hash == "#/users") {
      ///find all users
      $http.get('/api/users')
      .then(function(data){
        console.log(data);
        var userList = data.data;
        self.allUsers = userList;
      });
    } else if(window.location.hash.split('/')[1] == "signin"){

      $('.signinSubmit').on('click', function(){
        var email = $(".signInput1").val();
        console.log(email);
        var password = $(".signInput2").val();
        console.log(password);
        var data = {email: email, password: password}
        $http({
          method: "POST",
          data: data,
          url: "/login"
        })
        .then(function(data){
          console.log(data);
          if (data.data != "No user found") {
            console.log('in here');
            console.log(data);
            window.localStorage.sessionToken = data.data.token;
            window.localStorage.sessionUser = data.data.user.email;
            self.userSesh = email;
            console.log('user email is:',self.userSesh);
            var url = window.location.hash.split('/')[2];
            console.log(url);
            if(url){
              window.location.hash = '#/newresponse/'+url;
              window.location.reload();
            }
            else {
              window.location.reload();
              window.location.hash = "#/";

            }

          } else {
            window.location.hash = "#/signup"
          }
        })
      })
    } else {
      // find single User
      // var hashArray = window.location.hash.split("/");
      // var userId =hashArray[hashArray.length-1];
      // console.log(userId);
      // $http({
      //   url: '/api/users/'+userId,
      //   method: "GET"
      // })
      //   .then(function(data){
      //     console.log(data);
      //     self.singleUser = data.data.user.local.email;
      //     console.log(self.singleUser);
      //   })
    }
  }
