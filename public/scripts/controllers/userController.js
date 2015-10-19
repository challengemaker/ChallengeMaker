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

    ///using if statement to determine if we're looking at an "all users" list or single user's profile page
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
      })
      $(".signInput2").on('click', function(){
        $(".signInput2").val('')
        $(".signInput2")[0].type('password');
      })
      $('.signinSubmit').on('click', function(){
        var challenge = window.location.hash.split('/')[2];
        window.location.hash = "#/challenges/"+challenge;
      })
    } else {
      // find single User
      var hashArray = window.location.hash.split("/");
      var userName =hashArray[hashArray.length-1];
      $http.get('/api/users/'+userName)
      .then(function(data){
        var thisUser = data.data.name;
        self.singleUser = thisUser;
        console.log('This is the data returned:', data);
      });
    }
  }
