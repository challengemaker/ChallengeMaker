angular.module('challengesController', [])

  .controller('challengesCtrl', challengesCtrl)

  challengesCtrl.$inject = ['$http'];
  function challengesCtrl($http){
    var self = this;

		$http.get('/api/challenges')
        .then(function(data){
          self.allChallenges = data.data;
        })


    ////begin page if statement, for seperated data
    if(window.location.hash.split('/')[1] == 'youvebeenchallenged'){
      var challenge = window.location.hash.split('/')[2];
      $('.acceptButton').on('click', function(){
        window.location.hash = "#/signin/"+challenge;
      })

      $http.get('/api/challenges/'+challenge)
        .then(function(data){
          console.log(data.data);
          var url = data.data.videoUrl
          ///begin creating "youve been challenged" data model, which will later go into a factory
          self.beenChallengedData = data.data;
          $('.challengePhoto').on('click', function(){

            var height = $('.challengePhoto').height();
            var width = $('.challengePhoto').width();
            $('.challengePhoto').html('')
            $('.challengePhoto').html("<iframe class='currentVideo' min-width='100%' height='"+height+"' src='"+url+"' frameborder='0' allowfullscreen></iframe>")
          })
        })
    }
    else
    {
      var hashArray = window.location.hash.split("/");
      var thisName = hashArray[hashArray.length-1];
      self.nameParam = thisName;

      $http.get('/api/challenges/'+thisName)
        .then(function(data){
          self.singleChallenge = data.data;
        })
    }
    //////this will all be in a factory later
    $http.get('/api/responses')
      .then(function(data){
        var challengeResponses = data.data.reverse();//reversed so newest first
        var arrayLength = challengeResponses.length;
        // console.log(arrayLength);
        ///start creating rows
        var rowNum = Math.floor((arrayLength/2));
        self.rowNum = rowNum;

        var justRows = function(){
          var masterResponseArray = [];
          for (var i = 0; i < rowNum; i++) {
            ////now creating each cell
            var cell = {};
            var mini1 = challengeResponses[0];
            var mini2 = challengeResponses[1];
            challengeResponses.shift();
            challengeResponses.shift();
            cell.first = mini1;
            cell.second= mini2;
            masterResponseArray.push(cell);
          }
          return masterResponseArray;
        }
        self.justRows = justRows().slice(0,3);
        /////rows now created
      })
      //////begin $http call that will be put in a factory later
      // if(window.location.hash = "#/") {
      //   self.highlightOn = true;
      //   console.log('this worked');
      //
      //   self.hToggle = function(){
      //     self.width = $('.hMediaHolder').width();
      //     console.log(self.width);
      //     self.height = $('.hMediaHolder').height();
      //     console.log(self.height);
      //     console.log('youyoyoy');
      //     console.log(self.highlightOn);
      //     self.highlightOn = !self.highlightOn;
      //     console.log(self.highlightOn);
      //   }
      // }
      if (window.location.hash.length > 3 ){
      var challengeName = window.location.hash.split('/')[2].split('-').join(' ');
      console.log(challengeName);
      $http.get('/api/challenges/'+challengeName)
        .then(function(data){
          var url = "https://www.youtube.com/embed/TipgAV6hhP8?autoplay=1"
          console.log(data);
          self.singleChallenge = data.data;
          $('.currImg').on('click', function(){
            var height = $('.currentChallengeImage').height();
            var width = $('.currentChallengeImage').width();
            $('.currentChallengeImage').html('')
            $('.currentChallengeInfo').html(" ")
            $('.currentChallengeImage').html("<iframe class='currentVideo' min-width='100%' height='"+height+"' src='"+url+"' frameborder='0' allowfullscreen></iframe>")
          })
        })
        $('.completeChallButton').on('click', function(){
          window.location.hash = "#/newresponse/"+self.nameParam
        })
      }
      else if(window.location.hash.length == 2) {
        self.highlightOn = true;
        console.log('this worked');

        self.hToggle = function(){
          self.width = $('.hMediaHolder').width();
          console.log(self.width);
          self.height = $('.hMediaHolder').height();
          console.log(self.height);
          console.log('youyoyoy');
          console.log(self.highlightOn);
          self.highlightOn = !self.highlightOn;
          console.log(self.highlightOn);
        }
      }
    /////end of the oage-based if statement
  }
