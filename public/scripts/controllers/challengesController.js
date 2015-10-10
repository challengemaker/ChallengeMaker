angular.module('challengesController', [])

  .controller('challengesCtrl', challengesCtrl)

  function challengesCtrl($http){
    var self = this;

    self.upDog = "What's up dog?"


    if (window.location.hash == "#/challenges") {
      $http.get('/api/challenges')
        .then(function(data){
          console.log(data.data);
          self.allChallenges = data.data;
        })
    }
    else
    {
      var hashArray = window.location.hash.split("/");
      console.log(hashArray);
      var challengeId = hashArray[hashArray.length - 1];
      console.log(challengeId);
      $http.get('/api/challenges/'+challengeId)
        .then(function(data){
          console.log(data.data);
          self.singleChallenge = data.data;
        })


    }

  }
