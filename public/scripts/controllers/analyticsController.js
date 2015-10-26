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

    //////////end controller
  }
