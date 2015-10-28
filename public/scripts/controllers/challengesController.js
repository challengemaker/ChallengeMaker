var app = angular.module('challengesController', [])

  .controller('challengesCtrl', challengesCtrl)


  challengesCtrl.$inject = ['$http', '$sce'];
  function challengesCtrl($http, $sce){
    var self = this;
    ///some quick blacklayer stuff
    function adjustHighlightBlack(){
      var imgHeight = $(".hImage").height();
      $('.blackLayer').css({
        height: imgHeight
      })
    }
    setInterval(adjustHighlightBlack, 30);
    ///////end blacklayer adjustment stuff
    //////////////////////
    ////begin dividing controller by page, this will be simplified by the use of factories
    ///////////set the blacklayer to adjust on the single challenge page
    if(window.location.hash.split('/')[1] == "challenges"){
      function adjustSingleBlack(){
        var imgHeight = $(".currImg").height();
        $('.blackLayerSingleHighlight').css({
          height: imgHeight
        })
      }
      setInterval(adjustSingleBlack, 500);
    }
    ////end adjust single challenge black layer
		$http.get('/api/challenges')
      .then(function(data){
        var allChallenges = data.data;
        self.specialChallenge = allChallenges[3]
        /////we'er adding an new attr to the object
        for (var i = 0; i < allChallenges.length; i++) {
          allChallenges[i].isPhoto = true;
        }
        self.allChallenges = allChallenges;
        //////now it's all set and ready to go
        self.goTo = function goTo(index){
          var elem = self.allChallenges[index];
          var parsedElem = elem.title.split(' ').join('-');
          window.location.hash = "#/challenges/"+parsedElem
        }
      })
      self.listVideoSources = [];
      self.swap = function swap(index){
        var height = ($(".lImageimg"+index).height()-5);
        var width = $(".lImageimg"+index).width();
        var videoHeight = $(".lVideo").height();
        var url = self.allChallenges[index].videoUrl+"?autoplay=1";
        if(height > 0) {
          $('.lVideo'+index).append(
            "<iframe class='listVid"+index+
            " listVid{{$index}}' width='100%'"+ "height='"+height+"' src='"+url+"' frameborder='0'"+ "webkitallowfullscreen mozallowfullscreen"+ "allowfullscreen>"+
            "</iframe>"
          )
          var src = $('.lImageimg'+index)[0].attributes.src.value;
          $('.lImageimg'+index).remove();
          $(".listRemove"+index).css({
            opacity: 0
          })
          self.listVideoSources[index] = src;
        } else {
          var imageSrc = self.listVideoSources[index];
          $('.listVid'+index).remove();
          $('.lVideo'+index).css({
            height: "0px"
          })
          $('.lImage'+index).append(
            "<img class='lImageImg lImageimg("+index+")'"+ "src='"+imageSrc+"'/>"
          )
          $(".listRemove"+index).css({
            opacity: 1
          })
        }
      }
      ////////start all the video-photo toggle actions
      //////////////begin the video=photo toggle on the listview, single challenge
      self.swapResponse = function swap(index){
        var height = ($(".lImageimg" +index).height()-5);
        var width = $(".lImageimg"+index).width();
        var videoHeight = $(".lVideo").height();
        var url = self.allResponses[index].videoUrl+"?autoplay=1";
        if(height > 0) {
          $('.lVideo'+index).append(
            "<iframe class='listVid"+index+
            " listVid{{$index}}' width='100%'"+ "height='"+height+"' src='"+url+"' frameborder='0'"+ "webkitallowfullscreen mozallowfullscreen"+ "allowfullscreen>"+
            "</iframe>"
          )
          $('.lImage'+index).css('height', "0px")
          $('.lImageimg'+index).css('height', "0px");
        } else {
          $('.listVid'+index).remove();
          $('.lImage'+index).css('height', videoHeight)
          $('.lImageimg'+index).css('height', videoHeight)
        }
      }
      /////begin for the big vahllenge on the home page
      self.swapSpecial = function swapSpecial(){
        var height = ($(".hImage").height()-5);
        var videoHeight = $(".hVideo").height();
        var url = self.specialChallenge.videoUrl+"?autoplay=1";

        if(height > 0) {
          $('.hVideo').append(
            "<iframe class='specialVid"+
            "'width='100%'"+ "height='"+height+"' src='"+url+"' frameborder='0'"+ "webkitallowfullscreen mozallowfullscreen"+ "allowfullscreen>"+
            "</iframe>"
          )
          $('.hImage').css('height', "0px")
          $('.hImageImg').css('height', "0px")
          $('.titleCont').css({
            opacity: 0
          })
          $('.hRemoveDescription').css({
            opacity: 0
          })
          $('.blackLayer').css({
            width: "0px"
          })
        } else {
          $('.titleCont').css({
            opacity: 1
          })
          $('.hRemoveDescription').css({
            opacity: 1
          })
          $('.blackLayer').css({
            width: "100%"
          })
          $('.specialVid').remove();
          $('.hImage').css('height', videoHeight)
          $('.hImageImg').css('height', videoHeight)
        }
      }
      //////singlehighlight swap
      self.swapHighlightSingle = function(){
        var height = ($(".currentChallengeImage").height()-5);
        var videoHeight = $(".shVideo").height();
        var url = self.singleChallenge.videoUrl+"?autoplay=1";
        if(height > 0) {
          $('.shVideo').append(
            "<iframe class='singleVid"+
            "'width='100%'"+ "height='"+height+"' src='"+url+"' frameborder='0'"+ "webkitallowfullscreen mozallowfullscreen"+ "allowfullscreen>"+
            "</iframe>"
          )
          $('.currentChallengeImage').css('height', "0px")
          $('.currImg').css('height', "0px")
          $('.titleCont').css({
            opacity: 0
          })
          $('.currentInfoColumn').css({
            opacity: 0
          })
          $('.blackLayerSingleHighlight').css({
            width: "0px"
          })
        } else {
          $('.singleVid').remove();
          $('.titleCont').css({
            opacity: 1
          })
          $('.currentInfoColumn').css({
            opacity: 1
          })
          $('.blackLayerSingleHighlight').css({
            width: "100%"
          })
          $('.singelVid').remove();
          $('.currentChallengeImage').css('height', videoHeight)
          $('.currImg').css('height', videoHeight)
        }
      }
      self.seeChallenge = function(name){
        var challTitle = name.split(' ').join("-");
        window.location.hash = "#/challenges/"+challTitle;
      }
      ////////begin all font resizing work
      /////////////////////////////////////
      function makeFit(){
        var windowSize = $(window).width();
        if(windowSize < 1024){
          fixSpacing();
          $('.listSectionRemove').html("");
          $('.hRemoveDescription').html("");
          $('.titleCont').css({
            fontSize: "30px"
          })
        } else {
          $('.listSectionRemove').html(
            "<p class=listSectionRemove>$0 if completed or"+ "donate to this charity</p>"
          );
          $('.titleCont').css({
            fontSize: "52px"
          })
        }
      }
      $(window).resize(function(){
        makeFit()
      })
      makeFit();
      //////function to make first list item not jet up info to top box, this will go in the box resizing
      function fixSpacing(){
        $('.listText0').css({
          bottom: 40
        })
      }
      ////begin page if statement, for seperated data
      if(window.location.hash.split('/')[1] == 'youvebeenchallenged'){
        var challenge = window.location.hash.split('/')[2];
        console.log('challenge is: ',challenge);
        var challengerName = window.location.hash.split('/')[4].split('-').join(' ');
        console.log('name is:', challengerName);
        self.challengerName = challengerName;
        var challengerVideoId = window.location.hash.split('/')[3];
        console.log('video id si:',challengerVideoId);
        var challengerVideo = "https://www.youtube.com/embed/"+challengerVideoId
        self.challengerVideo = challengerVideo;
        $('.acceptButton').on('click', function(){
          var userToken = window.localStorage.sessionToken
          var challengeName = window.location.hash.split('/')[3]
          if(userToken && userToken != "none"){
            window.location.hash = "#/"+challengeName
          } else {
            window.location.hash = "#/signin/"+challenge;
          }
        })
        function setBeenBlack() {
          var height = $('.challImg').height();
          $('.blackLayerBeen').height(height);
        }
        setInterval(setBeenBlack, 80);

        $http.get('/api/challenges/'+challenge)
          .then(function(data){
            var url = self.challengerVideo
            ///begin creating "youve been challenged" data model, which will later go into a factory
            self.beenChallengedData = data.data;
            self.toggleBeen = function(){
              var height = ($('.challImg').height() - 5);
              var videoHeight = $('.currentVideo').height();
              var width = $('.challImg').width();
              if(height > 0){
                $('.challImg').css({
                  height: '0px'
                })
                $('.challengePhoto').append("<iframe class='currentVideo' min-width='"+width+"' height='"+height+"' src='"+url+"' frameborder='0' allowfullscreen></iframe>")
                $('.challengeDescription').css({
                  opacity: 0
                })
                $('.challengeCharity').css({
                  opacity: 0
                })
              } else {
                $('.challengeDescription').css({
                  opacity: 1
                })
                $('.challengeCharity').css({
                  opacity: 1
                })
                $('.currentVideo').remove();
                $('.challImg').css({
                  height: videoHeight
                })

              }

            }
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
          var thisChall = window.location.hash.split('/')[2];

          var rawResponses = data.data.reverse();
          var arrResponses = [];
          for (var i = 0; i < rawResponses.length; i++) {
            console.log(rawResponses[i]);
            // var thisRespChall = rawResponses[i].data.challenge;
            // console.log(thisRespChall);
            // if( == )

          }
          ///////filter out all data that isn't specific to our challenge
          var challengeResponses = data.data.reverse();//reversed so newest first
          function addThumbToResponse(){
            for (var i = 0; i < challengeResponses.length; i++) {
              var videoLink = challengeResponses[i].videoUrl;
              var tubeKey = videoLink.split('/')[4];
              var thumbUrl = "img.youtube.com/vi/"+tubeKey+"/0.jpg";
              challengeResponses[i].tubeKey = tubeKey;
              challengeResponses[i].thumb = thumbUrl;
            }
            self.allResponses = challengeResponses;
          }
          addThumbToResponse();
        })
        if (window.location.hash.length > 3 ){
        var challengeName = window.location.hash.split('/')[2].split('-').join(' ');
        $http.get('/api/challenges/'+challengeName)
          .then(function(data){
            var url = "https://www.youtube.com/embed/TipgAV6hhP8?autoplay=1"
            self.singleChallenge = data.data;
            $('.currImg').on('click', function(){
              var height = $('.currentChallengeImage').height();
              var width = $('.currentChallengeImage').width();
              $('.currentChallengeImage').html('')
              $('.currentChallengeInfo').html(" ")
              $('.currentChallengeImage').html("<iframe class='currentVideo' min-width='100%' height='"+height+"' src='"+url+"' frameborder='0' onStateChange='onStop' allowfullscreen></iframe>")
            })
          })
          $('.completeChallButton').on('click', function(){
            var yesToken = window.localStorage.sessionToken;
            var url = window.location.hash.split('/')[2];
            if(yesToken && yesToken != "none") {
              window.location.hash = "#/newresponse/"+url
            }
            else {
              window.location.hash = "#/signin/"+url;
            }
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
      /////end of the page-based if statement
      ////////////////////end of the controller
    }
