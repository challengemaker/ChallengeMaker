angular.module('userController', [])

  .controller('userCtrl', userCtrl)

  function userCtrl($http){
    var self = this;

    ///using if statement to determine if we're looking at an "all users" list or single user's profile page
    if (window.location.hash == "#/users") {
      ///find all users
      $http.get('/api/users')
      .then(function(data){
        console.log(data);
        var userList = data.data;
        self.allUsers = userList;
      });
    } else {
      // find single User
      var hashArray = window.location.hash.split("/");
      console.log(hashArray);
      var userName =hashArray[hashArray.length-1];
      console.log(userName);
      $http.get('/api/users/'+userName)
      .then(function(data){
        console.log(data);
        var thisUser = data.data.name;
        self.singleUser = thisUser;
      });
    }

  }
