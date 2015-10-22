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

    $('.goToLogin').on("click", function(){
      window.location.hash = "#/signin"
    })

    ///using if statement to determine if we're looking at an "all users" list or single user's profile page
    if(window.location.hash == "#/signup"){
      console.log('yo');
      $(".submitNew").on('click', submitNew);
      function submitNew(){
        console.log('hi');
        var email = $('.signupEmail').val();
        var password = $('.signupPw').val();
        $http({
          data: {email: email, password: password},
          method: 'POST',
          url: '/signup'
        })
        .then(function(data){
          console.log(data);
          $http({
            data: {email: email, password: password},
            method: 'POST',
            url: '/login'
          }).
          then(function(data){
            window.localStorage.sessionToken = data.data.token;
            window.localStorage.sessionUser = data.data.user.email;
            self.userSesh = window.localStorage.sessionUser;
            console.log('user email is:',self.userSesh);
            window.location.reload();
          })
          // window.location.hash = "/profile";
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
        var password = $(".signInput2").val();
        var data = {email: email, password: password}
        $http({
          method: "POST",
          data: data,
          url: "/login"
        })
        .then(function(data){
          if(data.data != "No user found"){
            console.log('in here');
            console.log(data);
            window.localStorage.sessionToken = data.data.token;
            window.localStorage.sessionUser = data.data.user.email;
            self.userSesh = email;
            console.log('user email is:',self.userSesh);
            window.location.reload();
          } else {
            window.location.hash = "#/signup"
          }
        })
      })
    } else {
      // find single User
      var hashArray = window.location.hash.split("/");
      var userId =hashArray[hashArray.length-1];
      console.log(userId);
      $http({
        url: '/api/users/'+userId,
        method: "GET"
      })
        .then(function(data){
          console.log(data);
          self.singleUser = data.data.user.local.email;
          console.log(self.singleUser);
        })
    }
  }
