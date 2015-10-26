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

    $('.goToSigninChallenge').on('click', function(){
      var respondChallenge = window.location.hash.split('/')[2];
      console.log(respondChallenge);
      window.location.hash = "#/newresponse/"+respondChallenge
    })

    //////begin profile section
    ///////////////////////////
    ///////////////////////////
    var thisUser = window.location.hash.split("/")[2];
    console.log(thisUser);
    self.thisUser = thisUser

    ////create editor popup thingy
    self.profileCounter = true;
    function editProfile(){
      var currentName = $('#username').text();
      $('#nameEditor').html("");
      $('#nameEditor').html(
        "<input id='usernameEdit' type='text' value='"+currentName+"'>"
      );
      self.profileCounter = !self.profileCounter;
      console.log(self.profileCounter);
    }

    /////set the value
    function saveEdits(){
      var oldName = self.thisUser;
      var newName = $('#usernameEdit').val();
      console.log(newName);
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
        var newUrlName = newName.split(' ').join("-");
        window.location.hash = "#/users/"+newUrlName
      })
    }

    // if(self.profileCounter == true){
    $('#username').on('click', editProfile)
    // }
    // else if(self.profileCounter == false){
    $('#profileImage').on('click', saveEdits)
    // }



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
                window.localStorage.sessionUser = data.data.user.email;
                self.userSesh = window.localStorage.sessionUser;
                console.log('user email is:',self.userSesh);
                var responseUrl = window.location.hash.split('/')[2];
                console.log(responseUrl);
                if(responseUrl){
                  window.location.hash = "#/newresponse/"+responseUrl
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
      $(".signInput1").on('click', function(){
        $(".signInput1").val('')
      });
      $(".signInput2").on('click', function(){
        $(".signInput2").val('')
      });


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
            var url = window.location.hash.split('/').join(" ")[2];
            console.log(url);
            if(url){
              window.location.hash = '#/newresponse/'+url;
              window.location.reload();
            }
            else {
              window.location.hash = "#/";
              window.location.reload();
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
