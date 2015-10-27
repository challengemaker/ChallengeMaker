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
      var allFriendsChallenges = data.data;
      console.log(allFriendsChallenges);
      for (var i = 0; i < allFriendsChallenges.length; i++) {
        allFriendsChallenges[i].challengeUrlToSend = "https://challengemaker.herokuapp.com/#/youvebeenchallenged/"+allFriendsChallenges[i].challenge + "/" + allFriendsChallenges[i].friendVideoUrl.split('/')[4];
        console.log(allFriendsChallenges[i]);
      }
      self.allFriendsChallenges = allFriendsChallenges
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
        if(self.passwordCorrect){
          $('.passwordBox').html('')
        }
      })
    })
    ///keypress event
    $('.pwAttempt').keypress(function(evt){
      console.log(evt);
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
        if(self.passwordCorrect){
          $('.passwordBox').html('')
        }
      })
    })


    //////////end controller
  }
