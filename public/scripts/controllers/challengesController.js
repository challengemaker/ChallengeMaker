var app = angular.module('challengesController', [])

  .controller('challengesCtrl', challengesCtrl)


  challengesCtrl.$inject = ['$http', '$sce'];
  function challengesCtrl($http, $sce){
    var self = this;
    //////////////////////////////
    ///some quick blacklayer stuff
    function adjustHighlightBlack(){
      var imgHeight = $(".hImage").height();
      $('.blackLayer').css({
        height: imgHeight
      })
    }
    setInterval(adjustHighlightBlack, 30);
    ///////let's do a quick black layer adjustment for the listview on the homepage
    function adjustBlackListAll(){
      var listImgHeight = $(".lMediaHolder").height()
      // var multipleLayer = Math.ceil(self.allChallenges.length/2)
      if($(window).width() > 992){
        var multipleLayer = Math.ceil(self.allChallenges.length/2)
      } else {
        var multipleLayer = self.allChallenges.length
      }
      var newHeight = ((listImgHeight * multipleLayer)+(multipleLayer*5))
      $('.blackLayerListAll').css({
        height: newHeight
      })
    }
    setInterval(adjustBlackListAll, 50);
    ///////end quick black layer adjustment for the listview on the homepage
    ///////end blacklayer adjustment stuff
    /////////////////////////////////////
    ////begin dividing controller by page, this will be simplified by the use of factories
    if(window.location.hash.split('/')[1] == "challenges"){
      ////////////////////////////////////////////////////////////////////
      ///////////set the blacklayer to adjust on the single challenge page
      ///adjusts the black layer for them top highlighted challenge
      function adjustSingleBlack(){
        var imgHeight = $(".currImg").height();
        $('.blackLayerSingleHighlight').css({
          height: imgHeight
        })
      }
      setInterval(adjustSingleBlack, 500);
      ////////////adjust listview single challenge blacklayer
      function adjustSingleBlackList(){
        var imgHeight = $(".lImage0").height()
        // var heightMultiple = self.allResponses.length/2
        if($(window).width() > 992){
          var heightMultiple = Math.ceil(self.allResponses.length/2)
        } else {
          var heightMultiple = self.allResponses.length
        }
        var newListHeight = ((imgHeight * heightMultiple)+(heightMultiple*5))
        $('.blackLayerSingleChallengeList').css({
          height: newListHeight+39
        })
      }
      setInterval(adjustSingleBlackList, 30)
      ////end adjust single challenge black layer
      //////////////////////////////////////////
    }

    ///////////////////////////////////////////
    ///////////////////function to give us

    /////simple call to bring in all challenges
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
      ////end call to get all challenges

      /////begin code to toggle picture and video on the site
      self.listVideoSources = []
      self.startListCounter = []
      self.listVideoToggleCounters = []
      self.swap = function swap(index){
        var height = ($(".lImageimg"+index).height()-5)
        console.log(height)
        var width = $(".lImageimg"+index).width()
        var videoHeight = $(".lVideo"+index).height()
        var url = self.allChallenges[index].videoUrl+"?autoplay=1";
        ////////this next only triggers if it's the first time it's been clicked
        if(height > 0) {
          $('.lImageimg'+index).height('0px')
          $('.lVideo'+index).append(
            "<iframe class='listVid"+index+
            " listVid{{$index}}' width='100%'"+ "height='"+height+"' src='"+url+"' frameborder='0'"+ "webkitallowfullscreen mozallowfullscreen"+ "allowfullscreen>"+
            "</iframe>"
          )
          $('.lImage'+index).css('height', "0px")
          $('.lImageimg'+index).css('height', "0px")

          var src = $('.lImageimg'+index)[0].attributes.src.value;
          // $(".listRemove"+index).css({
          //   opacity: 0
          // })
          self.listVideoSources[index] = src
        } else {
          var imageSrc = self.listVideoSources[index]
          $('.listVid'+index).remove();
          $('.lImage'+index).css('height', videoHeight)
          $('.lImageimg'+index).css('height', videoHeight)
          // $('.listVid'+index).remove();
          // $('.lVideo'+index).css({
          //   height: "0px"
          // })
          // $('.lImage'+index).append(
          //   "<img class='lImageImg lImageimg("+index+")' "+ "src='"+imageSrc+"'/>"
          // )
          // $(".listRemove"+index).css({
          //   opacity: 1
          // })
        }
      }
      ////////start all the video-photo toggle actions
      //////////////begin the video=photo toggle on the listview, single challenge
      self.swapResponse = function swap(index){
        var height = ($(".lImageimg" +index).height()-5);
        var width = $(".lImageimg"+index).width();
        var videoHeight = $(".lVideo"+index).height();
        var url = self.allResponses[index].videoUrl;
        if(height > 0) {
          $('.lVideo'+index).append(
            "<iframe class='listVid"+index+
            " listVid{{$index}}' width='100%'"+ "height='"+height+"' src='https://www.youtube.com/embed/"+url+"?autoplay=1' frameborder='0'"+ "webkitallowfullscreen mozallowfullscreen"+ "allowfullscreen>"+
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
          $('.playButtonH').css({
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

      //////function to make first list item not jet up info to top box, this will go in the box resizing
      function fixSpacing(){
        $('.listText0').css({
          bottom: 40
        })
      }
      ////begin page if statement, for seperated data
      if(window.location.hash.split('/')[1] == 'youvebeenchallenged'){
        var challenge = window.location.hash.split('/')[2];
        var challengerName = window.location.hash.split('/')[4].split('-').join(' ');
        self.challengerName = challengerName;
        var challengerVideoId = window.location.hash.split('/')[3];
        var challengerVideo = "https://www.youtube.com/embed/"+challengerVideoId
        self.challengerVideo = challengerVideo;
        $('.acceptButton').on('click', function(){
          var userToken = window.localStorage.sessionToken
          var challengeName = window.location.hash.split('/')[2]
          if(userToken && userToken != "none"){
            window.location.hash = "#/challenges/"+challengeName
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
          ///////filter out all data that isn't specific to our challenge
          var rawResponses = data.data.reverse();
          var arrResponses = [];
          for (var i = 0; i < rawResponses.length; i++) {
            var thisRespChall = rawResponses[i].challenge;
            if(thisRespChall == thisChall){
              arrResponses.push(rawResponses[i])
            }
          }
          var challengeResponses = arrResponses;

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
              window.location.hash = "#/newresponse/"+url;
              window.location.reload();
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

      ///////////////////////////////////////////////////////////////////////////////
      ////////////////Create a function to auto-adjust home page big window font-size
      function makeFit(){
        var windowSize = parseInt($(window).width())
        console.log(windowSize)
        console.log($(window).width())
        if(windowSize >= 1427){
          console.log('yellow')
          $('.titleCont').css({
              fontSize: "114px"
            })
          $(".hRemoveDescription").css({
            marginTop: "70px"
          })
        } else if(windowSize >= 1415){
          $('.titleCont').css({
              fontSize: "113px"
            })
        } else if(windowSize >= 1402){
          $('.titleCont').css({
              fontSize: "112px"
            })
        } else if(windowSize >= 1390){
          $('.titleCont').css({
              fontSize: "111px"
            })
        } else if(windowSize >= 1377){
          $('.titleCont').css({
              fontSize: "110px"
            })
        } else if(windowSize >= 1364){
          $('.titleCont').css({
              fontSize: "109px"
            })
        } else if(windowSize >= 1352){
          $('.titleCont').css({
              fontSize: "108px"
            })
        } else if(windowSize >= 1340){
          $('.titleCont').css({
              fontSize: "107px"
            })
        } else if(windowSize >= 1327){
          $('.titleCont').css({
              fontSize: "106px"
            })
          $('.hRemoveDescription').css({
            marginTop: "63px"
          })
        } else if(windowSize >= 1314){
          $('.titleCont').css({
              fontSize: "105px"
            })
        } else if(windowSize >= 1302){
          $('.titleCont').css({
              fontSize: "104px"
            })
        } else if(windowSize >= 1290){
          $('.titleCont').css({
              fontSize: "103px"
            })
        } else if(windowSize >= 1277){
          $('.titleCont').css({
              fontSize: "102px"
            })
        } else if(windowSize >= 1265){
          $('.titleCont').css({
              fontSize: "101px"
            })
        } else if(windowSize >= 1252){
          $('.titleCont').css({
              fontSize: "100px"
            })
        } else if(windowSize >= 1240){
          $('.titleCont').css({
              fontSize: "99px"
            })
        } else if(windowSize >= 1227){
          $('.titleCont').css({
              fontSize: "98px"
            })
          $('.hRemoveDescription').css({
            marginTop: "56px"
          })
        } else if(windowSize >= 1214){
          $('.titleCont').css({
              fontSize: "97px"
            })
        } else if(windowSize >= 1202){
          $('.titleCont').css({
              fontSize: "96px"
            })
        } else if(windowSize >= 1189){
          $('.titleCont').css({
              fontSize: "95px"
            })
        } else if(windowSize >= 1177){
          $('.titleCont').css({
              fontSize: "93px"
            })
        } else if(windowSize >= 1164){
          $('.titleCont').css({
              fontSize: "92px"
            })
        } else if(windowSize >= 1152){
          $('.titleCont').css({
              fontSize: "91px"
            })
        } else if(windowSize >= 1139){
          $('.titleCont').css({
              fontSize: "90px"
            })
        } else if(windowSize >= 1126){
          $('.titleCont').css({
              fontSize: "89px"
            })
          $('.hRemoveDescription').css({
            marginTop: "49px"
          })
        } else if(windowSize >= 1114){
          $('.titleCont').css({
              fontSize: "88px"
            })
        } else if(windowSize >= 1102){
          $('.titleCont').css({
              fontSize: "87px"
            })
        } else if(windowSize >= 1089){
          $('.titleCont').css({
              fontSize: "86px"
            })
        } else if(windowSize >= 1077){
          $('.titleCont').css({
              fontSize: "85px"
            })
        } else if(windowSize >= 1064){
          $('.titleCont').css({
              fontSize: "84px"
            })
        } else if(windowSize >= 1051){
          $('.titleCont').css({
              fontSize: "83px"
            })
        } else if(windowSize >= 1039){
          $('.titleCont').css({
              fontSize: "82px"
            })
        } else if(windowSize >= 1027){
          $('.titleCont').css({
              fontSize: "81px"
            })
          $('.hRemoveDescription').css({
            marginTop: "42px"
          })
        } else if(windowSize >= 1014){
          $('.titleCont').css({
              fontSize: "80px"
            })
        } else if(windowSize >= 1060){
          $('.titleCont').css({
              fontSize: "79px"
            })
        } else if(windowSize >= 1001){
          $('.titleCont').css({
              fontSize: "78px"
            })
        } else if(windowSize >= 989){
          $('.titleCont').css({
              fontSize: "77px"
            })
        } else if(windowSize >= 976){
          $('.titleCont').css({
              fontSize: "76px"
            })
        } else if(windowSize >= 964){
          $('.titleCont').css({
              fontSize: "75px"
            })
        } else if(windowSize >= 951){
          $('.titleCont').css({
              fontSize: "74px"
            })
        } else if(windowSize >= 939){
          $('.titleCont').css({
              fontSize: "73px"
            })
          $('.hRemoveDescription').css({
            marginTop: "35px"
          })
        } else if(windowSize >= 926){
          $('.titleCont').css({
              fontSize: "72px"
            })
        } else if(windowSize >= 914){
          $('.titleCont').css({
              fontSize: "71px"
            })
        } else if(windowSize >= 901){
          $('.titleCont').css({
              fontSize: "70px"
            })
        } else if(windowSize >= 889){
          $('.titleCont').css({
              fontSize: "69px"
            })
        } else if(windowSize >= 876){
          $('.titleCont').css({
              fontSize: "68px"
            })
        } else if(windowSize >= 864){
          $('.titleCont').css({
              fontSize: "67px"
            })
        } else if(windowSize >= 851){
          $('.titleCont').css({
              fontSize: "66px"
            })
        } else if(windowSize >= 839){
          $('.titleCont').css({
              fontSize: "65px"
            })
          $('.hRemoveDescription').css({
            marginTop: "28px"
          })
        } else if(windowSize >= 826){
          $('.titleCont').css({
              fontSize: "64px"
            })
        } else if(windowSize >= 814){
          $('.titleCont').css({
              fontSize: "63px"
            })
        } else if(windowSize >= 801){
          $('.titleCont').css({
              fontSize: "62px"
            })
        } else if(windowSize >= 788){
          $('.titleCont').css({
              fontSize: "61px"
            })
        } else if(windowSize >= 776){
          $('.titleCont').css({
              fontSize: "60px"
            })
        } else if(windowSize >= 763){
          $('.titleCont').css({
              fontSize: "59px"
            })
        } else if(windowSize >= 751){
          $('.titleCont').css({
              fontSize: "58px"
            })
        } else if(windowSize >= 738){
          $('.titleCont').css({
              fontSize: "57px"
            })
          $('.hRemoveDescription').css({
            marginTop: "21px"
          })
        } else if(windowSize >= 726){
          $('.titleCont').css({
              fontSize: "56px"
            })
        } else if(windowSize >= 713){
          $('.titleCont').css({
              fontSize: "55px"
            })
        } else if(windowSize >= 701){
          $('.titleCont').css({
              fontSize: "54px"
            })
        } else if(windowSize >= 688){
          $('.titleCont').css({
              fontSize: "53px"
            })
        } else if(windowSize >= 676){
          $('.titleCont').css({
              fontSize: "52px"
            })
        } else if(windowSize >= 663){
          $('.titleCont').css({
              fontSize: "51px"
            })
        } else if(windowSize >= 651){
          $('.titleCont').css({
              fontSize: "50px"
            })
        } else if(windowSize >= 638){
          $('.titleCont').css({
              fontSize: "49px"
            })
          $('.hRemoveDescription').css({
            marginTop: "14px"
          })
        } else if(windowSize >= 626){
          $('.titleCont').css({
              fontSize: "48px"
            })
        } else if(windowSize >= 613){
          $('.titleCont').css({
              fontSize: "47px"
            })
        } else if(windowSize >= 600){
          $('.titleCont').css({
              fontSize: "46px"
            })
        } else if(windowSize >= 588){
          $('.titleCont').css({
              fontSize: "45px"
            })
        } else if(windowSize >= 575){
          $('.titleCont').css({
              fontSize: "44px"
            })
        } else if(windowSize >= 563){
          $('.titleCont').css({
              fontSize: "43px"
            })
        } else if(windowSize >= 550){
          $('.titleCont').css({
              fontSize: "42px"
            })
        } else if(windowSize >= 538){
          $('.titleCont').css({
              fontSize: "41px"
            })
          $('.hRemoveDescription').css({
            marginTop: "7px"
          })
        } else if(windowSize >= 525){
          $('.titleCont').css({
              fontSize: "40px"
            })
        } else if(windowSize >= 513){
          $('.titleCont').css({
              fontSize: "39px"
            })
        } else if(windowSize >= 500){
          $('.titleCont').css({
              fontSize: "38px"
            })
        } else if(windowSize >= 488){
          $('.titleCont').css({
              fontSize: "37px"
            })
        } else if(windowSize >= 475){
          $('.titleCont').css({
              fontSize: "36px"
            })
        } else if(windowSize >= 463){
          $('.titleCont').css({
              fontSize: "35px"
            })
        } else if(windowSize >= 450){
          $('.titleCont').css({
              fontSize: "34px"
            })
        } else if(windowSize >= 438){
          $('.titleCont').css({
              fontSize: "33px"
            })
          $('.hRemoveDescription').css({
            marginTop: "7px"
          })
        } else if(windowSize >= 425){
          $('.titleCont').css({
              fontSize: "32px"
            })
        } else if(windowSize >= 413){
          $('.titleCont').css({
              fontSize: "31px"
            })
        } else if(windowSize >= 400){
          $('.titleCont').css({
              fontSize: "30px"
            })
          $('.hRemoveDescription').css({
            marginTop: "0px"
          })
        }
      }
      $(window).resize(function(){
        makeFit()
      })
      makeFit()
      ///////////////////end creating font-adjusting function
      ///////////////////////////////////////////////////////

    ////////////////////end of the controller
    }
