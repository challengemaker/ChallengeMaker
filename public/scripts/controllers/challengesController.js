angular.module('challengesController', [])

  .controller('challengesCtrl', challengesCtrl)

  .factory('testFactory', testFactory)

  ////begin factory calls
  function testFactory(){
    var test = {};
    test.name = 'jack';
    test.motto = "Tough times don't last, tough people do";
    return test
  }
  /////end factory calls


  challengesCtrl.inject = ['$http', 'testFactory'];
  function challengesCtrl($http, testFactory){
    var self = this;

    console.log(testFactory.name);
    console.log(testFactory.motto);

    self.upDog = "What's up dog?"

    $('.acceptButton').on('click', function(){
      window.location.hash = "#/acceptchallenge"
    })

    if (window.location.hash == "#/challenges") {
      $http.get('/api/challenges')
        .then(function(data){
          self.allChallenges = data.data;
        })
    } else if(window.location.hash.split('/')[1] == 'youvebeenchallenged'){
      console.log('it worked chkdsjhfk');
      var challenge = window.location.hash.split('/')[2];
      console.log(challenge);
      $http.get('/api/challenges/'+challenge)
        .then(function(data){
          console.log(data);
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
