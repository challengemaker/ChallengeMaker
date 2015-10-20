angular.module('challengesController', [])

  .controller('challengesCtrl', challengesCtrl)

  challengesCtrl.$inject = ['$http', '$sce'];
  function challengesCtrl($http, $sce){
    var self = this;
		$http.get('/api/challenges')
        .then(function(data){
          self.specialChallenge = data.data[0];
          var allChallenges = data.data.slice(1, data.data.length - 1);
          console.log(allChallenges);

          /////clean up  repeat  data
          for (var i = 0; i < allChallenges.length; i++) {
            allChallenges[i].isPhoto = true;
            console.log(allChallenges[i].videoUrl);
            url = "https://www.youtube.com/embed/ccYg5HN0mDU";
            self.video = url.split('').slice(8, url.length-1).join('');
            console.log(self.video);
          }
          ////////////
          self.allChallenges = allChallenges;
          console.log(self.allChallenges);
      })

      self.swap = function swap(index){
        var height = $(".lImageImg").height();
        var width = $(".lImageImg").width();
        var videoHeight = $(".lVideo").height();
        var url = self.allChallenges[index].videoUrl+"?autoplay=1";
        console.log(url);
        console.log(height);
        console.log($('.lVideo'+index));
        if(height > 0) {
          $('.lVideo'+index).append(
            "<iframe class='listVid"+index+
            " listVid{{$index}}' width='100%'"+ "height='"+height+"' src='"+url+"' frameborder='0'"+ "webkitallowfullscreen mozallowfullscreen"+ "allowfullscreen>"+
            "</iframe>"
          )
          $('.lImage'+index).css('height', "0px")
          $('.lImageimg'+index).css('height', "0px")
        } else {
          $('.listVid'+index).remove();
          $('.lImage'+index).css('height', videoHeight)
          $('.lImageimg'+index).css('height', videoHeight)
        }
      }

      self.swapSpecial = function swapSpecial(){
        var height = $(".hImage").height();
        var videoHeight = $(".hVideo").height();
        var url = self.specialChallenge.videoUrl+"?autoplay=1";
        console.log(url);
        console.log(height);
        if(height > 0) {
          $('.hVideo').append(
            "<iframe class='specialVid"+
            "'width='100%'"+ "height='"+height+"' src='"+url+"' frameborder='0'"+ "webkitallowfullscreen mozallowfullscreen"+ "allowfullscreen>"+
            "</iframe>"
          )
          $('.hImage').css('height', "0px")
          $('.hImageImg').css('height', "0px")
        } else {
          $('.specialVid').remove();
          $('.hImage').css('height', videoHeight)
          $('.hImageImg').css('height', videoHeight)
        }
      }


      self.seeChallenge = function(name){
        var challTitle = name.split(' ').join("-");
        console.log(challTitle);
        window.location.hash = "#/challenges/"+challTitle;
      }


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
            $('.challengePhoto').html("<iframe class='currentVideo' min-width='"+width+"' height='"+height+"' src='"+url+"' frameborder='0' allowfullscreen></iframe>")
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
        self.hToggle = function(){
          self.width = $('.hMediaHolder').width();
          self.height = $('.hMediaHolder').height();
          self.highlightOn = !self.highlightOn;
        }
        self.lToggle = function(){
          self.listWidth = $('.lImageImg').width();
          self.listHeight = $('.lImageImg').height();
          self.listWidth1 = $('.lImage').width();
          self.listHeight1 = $('.lImage').height();
          console.log(self.listWidth);
          console.log(self.listHeight);
        }


        self.showDetails = function(elId){
          $("#"+elId).append(
            "<div class='detailsCont' id='cont"+elId+"'>"+
              "<h3>"+self.specialChallenge.description+"</h3>"+
            "</div>"
          )
        }
        self.showDetailsList = function(elId){
          $("#"+elId).append(
            "<div class='detailsContList' id='list"+elId+"'>"+
              "<p>"+self.allChallenges[elId].description+"</p>"+
            "</div>"
          )
        }
        self.removeDetails = function(elId){
          $('.detailsCont').remove();
        }
        self.removeDetailsList = function(elId){
          $('.detailsContList').remove();
        }
        ///end homepage
      }
    /////end of the oage-based if statement
  }
