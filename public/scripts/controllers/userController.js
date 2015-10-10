angular.module('userController', [])

  .controller('userCtrl', userCtrl)

  function userCtrl($http){
    var self = this;

    ///using if statement to determine if we're looking at an "all users" list or single user's profile page
    if (window.location.href == "http://localhost:5555/#/users" || window.location.href == "https://challengemaker.herokuapp.com/#/users") {
      ///find all users
      $http.get('/api/users')
      .then(function(data){
        console.log(data);
        var userList = data.data;
        self.allUsers = userList;
      });
    } else {
      // find single User
      var name = "jack";
      $http.get('/api/users/'+name)
      .then(function(data){
        console.log(data);
        var thisUser = data.data.name;
        self.singleUser = thisUser;
      });
    }

  }
