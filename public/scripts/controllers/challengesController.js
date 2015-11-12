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

    $('.donateNow').on('click', function(){
      var challenge = window.location.hash.split('/')[2]
      window.location.hash = "#/donate/challengefriends/"+challenge
    })
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
        var allChallenges = data.data.reverse()
        self.specialChallenge = allChallenges[allChallenges.length-1]
        /////we'er adding an new attr to the object
        for (var i = 0; i < allChallenges.length; i++) {
          allChallenges[i].isPhoto = true;
          if(allChallenges[i].title.length < 20){
            allChallenges[i].title = allChallenges[i].title
            // + " pppppppppppppppppp"
          }
          if(allChallenges[i].charity[0].length < 19){
            allChallenges[i].charity[0] = allChallenges[i].charity[0]
            // + " pppppppppppppppppp"
          }
        }
        allChallenges.pop()
        self.allChallenges = allChallenges
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
        var width = $(".lImageimg"+index).width()
        var videoHeight = $(".lVideo"+index).height()
        var url = self.allChallenges[index].videoUrl+"?autoplay=1";
        ////////this next only triggers if it's the first time it's been clicked
        if(height > 0) {
          $('.lImageimg'+index).height('0px')
          $('.lVideo'+index).append(
            "<iframe class='listVid"+index+"' width='100%'"+ "height='"+height+"' src='"+url+"' frameborder='0'"+ "webkitallowfullscreen mozallowfullscreen"+ "allowfullscreen>"+
            "</iframe>"
          )
          $('.lImage'+index).css('height', "0px")
          $('.lImageimg'+index).css('height', "0px")
          $('.listText'+index).css({
            marginLeft: '-2000px'
          })
          $('.acceptButton'+index).css({
            marginLeft: "2000px"
          })
          $('.listContainer'+index).css({
            zIndex: 150
          })
          var src = $('.lImageimg'+index)[0].attributes.src.value
          self.listVideoSources[index] = src
        } else {
          var imageSrc = self.listVideoSources[index]
          $('.listVid'+index).remove();
          // $('.listTextContent'+index).css({marginLeft: "0px"})
          $('.lImage'+index).css('height', videoHeight)
          $('.lImageimg'+index).css('height', videoHeight)
          $('.listText'+index).css({
            marginLeft: '-15px'
          })
          $('.listContainer'+index).css({
            zIndex: 150
          })
        }
      }
      // $('.clickLayerList').on('click', function(evt){
      //   var height = ($(".lImageimg"+index).height()-5)
      //   var width = $(".lImageimg"+index).width()
      //   var videoHeight = $(".lVideo"+index).height()
      //   var url = self.allChallenges[index].videoUrl+"?autoplay=1";
      //   ////////this next only triggers if it's the first time it's been clicked
      //   if(height > 0) {
      //     $('.lImageimg'+index).height('0px')
      //     $('.lVideo'+index).append(
      //       "<iframe class='listVid"+index+
      //       "' width='100%'"+ "height='"+height+"' src='"+url+"' frameborder='0'"+ "webkitallowfullscreen mozallowfullscreen"+ "allowfullscreen>"+
      //       "</iframe>"
      //     )
      //     $('.lImage'+index).css('height', "0px")
      //     $('.lImageimg'+index).css('height', "0px")
      //     var src = $('.lImageimg'+index)[0].attributes.src.value;
      //     self.listVideoSources[index] = src
      //   } else {
      //     var imageSrc = self.listVideoSources[index]
      //     $('.listVid'+index).remove();
      //     $('.lImage'+index).css('height', videoHeight)
      //     $('.lImageimg'+index).css('height', videoHeight)
      //   }
      // })
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
          $('.listText'+index).css({
            marginLeft: '-2000px'
          })
          $('.listText'+index).css({
            width: 0
          })
          console.log(index);
          $('.playButtonL'+index).css({
            marginLeft: '-2000px'
          })
          $('.playButtonL'+index).css({
            width: 0
          })
          $('.listContainer'+index).css({
            zIndex: 150
          })
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
            marginLeft: '-2000px'
          })
          $('.hRemoveDescription').css({
            marginLeft: '-2000px'
          })
          $('.highlightTextHolder').css({
            marginLeft: '-2000px'
          })
          $('.playButtonH').css({
            marginLeft: '-2000px'
          })
          $('.acceptButtonHome').css({
            marginLeft: '2030px',
            marginTop: '40px'
          })
          $('.blackLayer').css({
            width: "0px"
          })

          $('.specialVid')[0].playVideo()
        } else {
          $('.titleCont').css({
            marginLeft: '0px'
          })
          $('.hRemoveDescription').css({
            marginLeft: '0px'
          })
          $('.highlightTextHolder').css({
            marginLeft: '10%'
          })
          $('.playButtonH').css({
            marginLeft: '50%'
          })
          $('.blackLayer').css({
            width: "100%"
          })
          $('.specialVid').remove();
          $('.hImage').css('height', videoHeight)
          $('.hImageImg').css('height', videoHeight)
        }
      }
      // $('.tempButton').on('click', self.swapSpecial())
      /////begin for the big vahllenge on the home page
      self.swapSpecialYouve = function swapSpecialYouve(){
        var height = ($(".hImage").height()-5);
        var videoHeight = $(".hVideo").height();
        var url = "https://www.youtube.com/embed/"+self.challengerVideoId+"?autoplay=1"
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
        self.challenged = window.location.hash.split('/')[2].split('-').join(' ')
        var challengerName = window.location.hash.split('/')[4].split('-').join(' ')
        self.challengerName = challengerName;
        var challengerVideoId = window.location.hash.split('/')[3]
        self.challengerVideoId = challengerVideoId
        var challengerVideo = "https://www.youtube.com/embed/"+challengerVideoId
        self.vidThumb = "https://img.youtube.com/vi/"+self.challengerVideoId+"/0.jpg"
        self.challengerVideo = challengerVideo
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

        $http.get('/api/challenges/'+self.challenged)
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

      ///////begin "payment received" module for a sucessful donation
      ///////////////////////////////////////////////////////////////
        if(window.location.hash.split('/')[3] && window.location.hash.split('/')[3] == "paymentreceived"){
          console.log('you just came from a payment yo, thats rad!')
          // Thank you for making a donation to {{insert_charity_name}}. You will receive a follow up email with details for your records. Have a great one.
          $('.challengeContainer').append(
            "<div class='responseLightboxPaymentSuccess'>" +
              "<div class='responseLightboxText'>"+
                "<p>Thank you for your donation to XXX Charity. A Confirmation email will be sent to you shortly!</p>" +
              "</div>"+
              "<div class='okButton'> OK </div>"+
            "</div>"
          )
          $('.okButton').on('click', function(){
            $('.okButton').css({
              backgroundColor: '#C31C85'
              ,color: "white"
            })
            setTimeout(function(){
              $('.responseLightboxPaymentSuccess').remove()
            }, 100)
          })
          $('.okButton').on('mouseenter', function(){
            $('.okButton').css({
              backgroundColor: '#D4D4D4'
            })
          })
          $('.okButton').on('mouseleave', function(){
            $('.okButton').css({
              backgroundColor: '#F5F5F5'
            })
          })
          function responsiveError(){
            if($(window).width() < 525){
              $('.responseLightboxText').css({
                fontSize: "16px"
              })
            }
          }
          responsiveError()
          $(window).resize(function(){
            responsiveError()
          })
        }
      ///////////////////////////////////////////////////////////////
      ///////end payment received module/////////////////////////////

      ///////////////////////////////////////////////////////////////////////////////
      ////////////////Create a function to auto-adjust home page big window font-size
      function makeFit(){
        var windowSize = parseInt($(window).width())
        if(windowSize >= 1427){
          $('.titleCont').css({
              fontSize: "114px"
            })
          $('.listContent').css({
              fontSize: "45px"
          })
          $(".hRemoveDescription").css({
            marginTop: "70px"
          })
        } else if(windowSize >= 1415){
          $('.titleCont').css({
              fontSize: "113px"
            })
            $('.listContent').css({
                fontSize: "45px"
            })
        } else if(windowSize >= 1402){
          $('.titleCont').css({
              fontSize: "112px"
            })
          $('.listContent').css({
            fontSize: '44px'
          })
        } else if(windowSize >= 1390){
          $('.titleCont').css({
              fontSize: "111px"
            })
            $('.listContent').css({
              fontSize: '44px'
            })
        } else if(windowSize >= 1377){
          $('.titleCont').css({
              fontSize: "110px"
            })
          $('.listContent').css({
            fontSize: '43px'
          })
        } else if(windowSize >= 1364){
          $('.titleCont').css({
              fontSize: "109px"
            })
          $('.listContent').css({
            fontSize: '42px'
          })
        } else if(windowSize >= 1352){
          $('.titleCont').css({
              fontSize: "108px"
            })
            $('.listContent').css({
              fontSize: '42px'
            })
        } else if(windowSize >= 1340){
          $('.titleCont').css({
              fontSize: "107px"
            })
          $('.listContent').css({
            fontSize: '41px'
          })
        } else if(windowSize >= 1327){
          $('.titleCont').css({
              fontSize: "106px"
            })
          $('.hRemoveDescription').css({
            marginTop: "63px"
          })
          $('.listContent').css({
            fontSize: '41px'
          })
        } else if(windowSize >= 1314){
          $('.titleCont').css({
              fontSize: "105px"
            })
          $('.listContent').css({
            fontSize: '40px'
          })
        } else if(windowSize >= 1302){
          $('.titleCont').css({
              fontSize: "104px"
            })
          $('.listContent').css({
            fontSize: '40px'
          })
        } else if(windowSize >= 1290){
          $('.titleCont').css({
              fontSize: "103px"
            })
          $('.listContent').css({
            fontSize: '39px'
          })
        } else if(windowSize >= 1277){
          $('.titleCont').css({
              fontSize: "102px"
            })
          $('.listContent').css({
            fontSize: '39px'
          })
        } else if(windowSize >= 1265){
          $('.titleCont').css({
              fontSize: "101px"
            })
          $('.listContent').css({
            fontSize: '38px'
          })
        } else if(windowSize >= 1252){
          $('.titleCont').css({
              fontSize: "100px"
            })
          $('.listContent').css({
            fontSize: '38px'
          })
        } else if(windowSize >= 1240){
          $('.titleCont').css({
              fontSize: "99px"
            })
          $('.listContent').css({
            fontSize: '37px'
          })
        } else if(windowSize >= 1227){
          $('.titleCont').css({
              fontSize: "98px"
            })
          $('.hRemoveDescription').css({
            marginTop: "56px"
          })
          $('.listContent').css({
            fontSize: '37px'
          })
        } else if(windowSize >= 1214){
          $('.titleCont').css({
              fontSize: "97px"
            })
          $('.listContent').css({
            fontSize: '36px'
          })
        } else if(windowSize >= 1202){
          $('.titleCont').css({
              fontSize: "96px"
            })
            $('.listContent').css({
              fontSize: '36px'
            })
        } else if(windowSize >= 1189){
          $('.titleCont').css({
              fontSize: "95px"
            })
          $('.listContent').css({
            fontSize: '35px'
          })
        } else if(windowSize >= 1177){
          $('.titleCont').css({
              fontSize: "93px"
            })
            $('.listContent').css({
              fontSize: '35px'
            })
        } else if(windowSize >= 1164){
          $('.titleCont').css({
              fontSize: "92px"
            })
          $('.listContent').css({
            fontSize: '34px'
          })
        } else if(windowSize >= 1152){
          $('.titleCont').css({
              fontSize: "91px"
            })
          $('.listContent').css({
            fontSize: '34px'
          })
        } else if(windowSize >= 1139){
          $('.titleCont').css({
              fontSize: "90px"
            })
          $('.listContent').css({
            fontSize: '33px'
          })
        } else if(windowSize >= 1126){
          $('.titleCont').css({
              fontSize: "89px"
            })
          $('.hRemoveDescription').css({
            marginTop: "49px"
          })
          $('.listContent').css({
            fontSize: '33px'
          })
        } else if(windowSize >= 1114){
          $('.titleCont').css({
              fontSize: "88px"
            })
          $('.listContent').css({
            fontSize: '32px'
          })
        } else if(windowSize >= 1102){
          $('.titleCont').css({
              fontSize: "87px"
            })
          $('.listContent').css({
            fontSize: '32px'
          })
        } else if(windowSize >= 1089){
          $('.titleCont').css({
              fontSize: "86px"
            })
          $('.listContent').css({
            fontSize: '31px'
          })
        } else if(windowSize >= 1077){
          $('.titleCont').css({
              fontSize: "85px"
            })
          $('.listContent').css({
            fontSize: '31px'
          })
        } else if(windowSize >= 1064){
          $('.titleCont').css({
              fontSize: "84px"
            })
          $('.listContent').css({
            fontSize: '30px'
          })
        } else if(windowSize >= 1051){
          $('.titleCont').css({
              fontSize: "83px"
            })
          $('.listContent').css({
            fontSize: '30px'
          })
        } else if(windowSize >= 1039){
          $('.titleCont').css({
              fontSize: "82px"
            })
          $('.listContent').css({
            fontSize: '29px'
          })
        } else if(windowSize >= 1027){
          $('.titleCont').css({
              fontSize: "81px"
            })
          $('.hRemoveDescription').css({
            marginTop: "42px"
          })
          $('.listContent').css({
            fontSize: '28px'
          })
        } else if(windowSize >= 1014){
          $('.titleCont').css({
              fontSize: "80px"
            })
          $('.listContent').css({
            fontSize: '28px'
          })
        } else if(windowSize >= 1060){
          $('.titleCont').css({
              fontSize: "79px"
            })
          $('.listContent').css({
            fontSize: '27px'
          })
        } else if(windowSize >= 1001){
          $('.titleCont').css({
              fontSize: "78px"
            })
          $('.listContent').css({
            fontSize: '27px'
          })
        } else if(windowSize >= 993){
          $('.titleCont').css({
              fontSize: "77px"
            })
          $('.listContent').css({
            fontSize: '26px'
          })
        } else if(windowSize >= 976){
          $('.titleCont').css({
              fontSize: "76px"
            })
          $('.listContent').css({
              fontSize: "76px"
            })
        } else if(windowSize >= 964){
          $('.titleCont').css({
              fontSize: "75px"
            })
          $('.listContent').css({
              fontSize: "75px"
            })
        } else if(windowSize >= 951){
          $('.titleCont').css({
              fontSize: "74px"
            })
          $('.listContent').css({
              fontSize: "74px"
            })
        } else if(windowSize >= 939){
          $('.titleCont').css({
              fontSize: "73px"
            })
          $('.listContent').css({
              fontSize: "73px"
            })
          $('.hRemoveDescription').css({
            marginTop: "35px"
          })
        } else if(windowSize >= 926){
          $('.titleCont').css({
              fontSize: "72px"
            })
          $('.listContent').css({
              fontSize: "72px"
            })
        } else if(windowSize >= 914){
          $('.titleCont').css({
              fontSize: "71px"
            })
          $('.listContent').css({
              fontSize: "71px"
            })
        } else if(windowSize >= 901){
          $('.titleCont').css({
              fontSize: "70px"
            })
          $('.listContent').css({
              fontSize: "70px"
            })
        } else if(windowSize >= 889){
          $('.titleCont').css({
              fontSize: "69px"
            })
          $('.listContent').css({
              fontSize: "69px"
            })
        } else if(windowSize >= 876){
          $('.titleCont').css({
              fontSize: "68px"
            })
          $('.listContent').css({
              fontSize: "68px"
            })
        } else if(windowSize >= 864){
          $('.titleCont').css({
              fontSize: "67px"
            })
          $('.listContent').css({
              fontSize: "67px"
            })
        } else if(windowSize >= 851){
          $('.titleCont').css({
              fontSize: "66px"
            })
          $('.listContent').css({
              fontSize: "66px"
            })
        } else if(windowSize >= 839){
          $('.titleCont').css({
              fontSize: "65px"
            })
          $('.listContent').css({
              fontSize: "65px"
            })
          $('.hRemoveDescription').css({
            marginTop: "28px"
          })
        } else if(windowSize >= 826){
          $('.titleCont').css({
              fontSize: "64px"
            })
          $('.listContent').css({
              fontSize: "64px"
            })
        } else if(windowSize >= 814){
          $('.titleCont').css({
              fontSize: "63px"
            })
          $('.listContent').css({
              fontSize: "63px"
            })
        } else if(windowSize >= 801){
          $('.titleCont').css({
              fontSize: "62px"
            })
          $('.listContent').css({
              fontSize: "62px"
            })
        } else if(windowSize >= 788){
          $('.titleCont').css({
              fontSize: "61px"
            })
          $('.listContent').css({
              fontSize: "61px"
            })
        } else if(windowSize >= 776){
          $('.titleCont').css({
              fontSize: "60px"
            })
          $('.listContent').css({
              fontSize: "60px"
            })
        } else if(windowSize >= 763){
          $('.titleCont').css({
              fontSize: "59px"
            })
          $('.listContent').css({
              fontSize: "59px"
            })
        } else if(windowSize >= 751){
          $('.titleCont').css({
              fontSize: "58px"
            })
          $('.listContent').css({
              fontSize: "58px"
            })
        } else if(windowSize >= 738){
          $('.titleCont').css({
              fontSize: "57px"
            })
          $('.listContent').css({
              fontSize: "57px"
            })
          $('.hRemoveDescription').css({
            marginTop: "21px"
          })
        } else if(windowSize >= 726){
          $('.titleCont').css({
              fontSize: "56px"
            })
          $('.listContent').css({
              fontSize: "56px"
            })
        } else if(windowSize >= 713){
          $('.titleCont').css({
              fontSize: "55px"
            })
          $('.listContent').css({
              fontSize: "55px"
            })
        } else if(windowSize >= 701){
          $('.titleCont').css({
              fontSize: "54px"
            })
          $('.listContent').css({
              fontSize: "54px"
            })
        } else if(windowSize >= 688){
          $('.titleCont').css({
              fontSize: "53px"
            })
          $('.listContent').css({
              fontSize: "53px"
            })
        } else if(windowSize >= 676){
          $('.titleCont').css({
              fontSize: "52px"
            })
          $('.listContent').css({
              fontSize: "52px"
            })
        } else if(windowSize >= 663){
          $('.titleCont').css({
              fontSize: "51px"
            })
          $('.listContent').css({
              fontSize: "51px"
            })
        } else if(windowSize >= 651){
          $('.titleCont').css({
              fontSize: "50px"
            })
          $('.listContent').css({
              fontSize: "50px"
            })
        } else if(windowSize >= 638){
          $('.titleCont').css({
              fontSize: "49px"
            })
          $('.listContent').css({
              fontSize: "49px"
            })
          $('.hRemoveDescription').css({
            marginTop: "14px"
          })
        } else if(windowSize >= 626){
          $('.titleCont').css({
              fontSize: "48px"
            })
          $('.listContent').css({
              fontSize: "48px"
            })
        } else if(windowSize >= 613){
          $('.titleCont').css({
              fontSize: "47px"
            })
          $('.listContent').css({
              fontSize: "47px"
            })
        } else if(windowSize >= 600){
          $('.titleCont').css({
              fontSize: "46px"
            })
          $('.listContent').css({
              fontSize: "46px"
            })
        } else if(windowSize >= 588){
          $('.titleCont').css({
              fontSize: "45px"
            })
          $('.listContent').css({
              fontSize: "45px"
            })
        } else if(windowSize >= 575){
          $('.titleCont').css({
              fontSize: "44px"
            })
          $('.listContent').css({
              fontSize: "44px"
            })
        } else if(windowSize >= 563){
          $('.titleCont').css({
              fontSize: "43px"
            })
          $('.listContent').css({
              fontSize: "43px"
            })
        } else if(windowSize >= 550){
          $('.titleCont').css({
              fontSize: "42px"
            })
          $('.listContent').css({
              fontSize: "42px"
            })
        } else if(windowSize >= 538){
          $('.titleCont').css({
              fontSize: "41px"
            })
          $('.listContent').css({
              fontSize: "41px"
            })
          $('.hRemoveDescription').css({
            marginTop: "7px"
          })
        } else if(windowSize >= 525){
          $('.titleCont').css({
              fontSize: "40px"
            })
          $('.listContent').css({
              fontSize: "40px"
            })
        } else if(windowSize >= 513){
          $('.titleCont').css({
              fontSize: "39px"
            })
          $('.listContent').css({
              fontSize: "39px"
            })
        } else if(windowSize >= 500){
          $('.titleCont').css({
              fontSize: "38px"
            })
          $('.listContent').css({
              fontSize: "38px"
            })
        } else if(windowSize >= 488){
          $('.titleCont').css({
              fontSize: "37px"
            })
        } else if(windowSize >= 475){
          $('.listContent').css({
              fontSize: "37px"
            })
        } else if(windowSize >= 475){
          $('.titleCont').css({
              fontSize: "36px"
            })
          $('.listContent').css({
              fontSize: "36px"
            })
        } else if(windowSize >= 463){
          $('.titleCont').css({
              fontSize: "35px"
            })
          $('.listContent').css({
              fontSize: "35px"
            })
        } else if(windowSize >= 450){
          $('.titleCont').css({
              fontSize: "34px"
            })
          $('.listContent').css({
              fontSize: "34px"
            })
        } else if(windowSize >= 438){
          $('.titleCont').css({
              fontSize: "33px"
            })
          $('.listContent').css({
              fontSize: "33px"
            })
          $('.hRemoveDescription').css({
            marginTop: "7px"
          })
        } else if(windowSize >= 425){
          $('.titleCont').css({
              fontSize: "32px"
            })
          $('.listContent').css({
              fontSize: "32px"
            })
        } else if(windowSize >= 413){
          $('.titleCont').css({
              fontSize: "31px"
            })
          $('.listContent').css({
              fontSize: "31px"
            })
        } else if(windowSize >= 400){
          $('.titleCont').css({
              fontSize: "30px"
            })
          $('.listContent').css({
              fontSize: "19px"
            })
          $('.hRemoveDescription').css({
            marginTop: "0px"
          })
        }
      }
      $(window).resize(function(){
        makeFit()
      })
      setTimeout(function(){
        makeFit()
      }, 500)
      ///////////////////end creating font-adjusting function
      ///////////////////////////////////////////////////////

    ////////////////////end of the controller
    }
