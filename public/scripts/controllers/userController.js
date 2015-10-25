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
                // window.localStorage.sessionToken = data.data.token;
                // window.localStorage.sessionUser = data.data.user.email;
                // self.userSesh = window.localStorage.sessionUser;
                // console.log('user email is:',self.userSesh);
                // window.location.reload();
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
            window.location.reload();
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
