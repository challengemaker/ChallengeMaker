angular.module('challengesController', [])

  .controller('challengesCtrl', challengesCtrl)

  function challengesCtrl($http){
    var self = this;

    self.upDog = "What's up dog?"


    if (window.location.hash == "#/challenges") {
      $http.get('/api/challenges')
        .then(function(data){
          self.allChallenges = data.data;
        })
    }
    else
    {
      var hashArray = window.location.hash.split("/");
      var thisName = hashArray[hashArray.length-1];

      $http.get('/api/challenges/'+thisName)
        .then(function(data){
          self.singleChallenge = data.data;
        })


    }

  }
