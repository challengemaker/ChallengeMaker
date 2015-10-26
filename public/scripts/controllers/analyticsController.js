var app = angular.module('analyticsController', [])

  .controller('analyticsCtrl', analyticsCtrl);

  analyticsCtrl.$inject = ['$http'];
  function analyticsCtrl($http){
    var self = this;

    $http({
      method: "GET",
      url: "/api/challengefriends"
    })
    .then(function(data){
      console.log(data);
      self.allFriendsChallenges = data.data;
      console.log(self.allFriendsChallenges);
    })


    /////check password
    $('.pwChecker').on('click', function(){
      var attempt = $('.pwAttempt').val();
      console.log(attempt);
      $http({
        method: "POST"
        ,url: "/api/password"
        ,data: {password: attempt}
      })
      .then(function(data){
        console.log(data);
        self.passwordCorrect = data.data.valid;
      })
    })


    //////////end controller
  }
