angular.module('challengesController', [])

  .controller('challengesCtrl', challengesCtrl)

  .factory('testFactory', testFactory)

  ////begin factory calls
  function testFactory(){
    // var test = {};
    // test.name = 'jack';
    // test.motto = "Tough times don't last, tough people do";
    // console.log(test);
    // return test;
  }
  /////end factory calls

  challengesCtrl.$inject = ['$http'];
  function challengesCtrl($http){
    var self = this;

    self.upDog = "What's up dog?"

    ////event listener to go start creating new response
    ///end new response event

    ////begin page if statement, for seperated data
    if (window.location.hash == "#/challenges") {
      $http.get('/api/challenges')
        .then(function(data){
          self.allChallenges = data.data;
        })
    } else if(window.location.hash.split('/')[1] == 'youvebeenchallenged'){
      var challenge = window.location.hash.split('/')[2];
      console.log(challenge);

      $('.acceptButton').on('click', function(){
        window.location.hash = "#/newresponse/"+challenge;
      })
      
      $http.get('/api/challenges/'+challenge)
        .then(function(data){
          console.log(data);
          ///begin creating "youve been challenged" data model, which will later go into a factory
          self.beenChallengedData = data.data;
          console.log(self.beenChallengedData);
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
    /////end of the oage-based if statement

  }
