angular.module('userController', [])

  .controller('userCtrl', userCtrl)

  function userCtrl($http){
    var self = this;

      $http.get('/api/users')
      .then(function(data){
        console.log(data);
        var userList = data.data;
        self.allUsers = userList;
      });
    }
