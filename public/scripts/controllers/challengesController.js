angular.module('challengesController', [])

  .controller('challengesCtrl', challengesCtrl)

  challengesCtrl.$inject = ['$http'];
  function challengesCtrl($http){
    var self = this;
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
    //////this will all be in a factory later
    $http.get('/api/responses')
      .then(function(data){
        var challengeResponses = data.data.reverse();//reversed so newest first
        console.log(challengeResponses);
        var arrayLength = challengeResponses.length;
        console.log(arrayLength);
        // console.log(arrayLength);
        ///start creating rows
        var rowNum = Math.floor((arrayLength/2)+1);
        console.log(rowNum);

        var justRows = function(){
          var masterResponseArray = [];
          console.log('starting loop');
          console.log(rowNum);
          for (var i = 0; i < rowNum; i++) {
            ////now creating each cell
            console.log('in loop');
            var cell = {};
            var mini1 = challengeResponses[0];
            var mini2 = challengeResponses[1];
            challengeResponses.shift();
            challengeResponses.shift();
            cell.first = mini1;
            cell.second= mini2;
            masterResponseArray.push(cell);
          }
          console.log(masterResponseArray);
          return masterResponseArray;
        }
        self.justRows = justRows();
        /////rows now created
        ///creating data to go inside the rows (will be a factory later)
        ////end creating row data
      })
    /////end of the oage-based if statement

  }
