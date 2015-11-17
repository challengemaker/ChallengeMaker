var app = angular.module('challengesController', [])

  .controller('challengesCtrl', challengesCtrl)


  challengesCtrl.$inject = ['$http', '$sce'];
  function challengesCtrl($http, $sce){
    var self = this
    //////////////////////////////
    ///some quick blacklayer stuff
    function adjustHighlightBlack(){
      var imgHeight = $(".hImage").height();
      $('.blackLayer').css({
        height: imgHeight
      })
    }
    // setInterval(adjustHighlightBlack, 30);
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
    // setInterval(adjustBlackListAll, 50);
    ///////end quick black layer adjustment for the listview on the homepage
    ///////end blacklayer adjustment stuff

    $('.acceptButton').on('mouseenter', function(){
      $('.acceptButton').attr('src', "../assets/pink_accept_rollover.svg")
    })
    $('.acceptButton').on('mouseleave', function(){
      $('.acceptButton').attr('src', "../assets/pink_accept_button.svg")
    })

    ///////////////////do all individaul adjustments for listview css
    if(window.location.hash == "#/"){
      setTimeout(function(){
        var list = $('.acceptButtonList')
        for (var i = 0; i < list.length; i++) {
          $('.acceptButton'+i).on('mouseenter', function(evt){
            evt.target.src =  "../assets/pink_accept_rollover.svg"
          })
          $('.acceptButton'+i).on('mouseleave', function(evt){
            evt.target.src = "../assets/pink_accept_button.svg"
          })
          /////////adjust list description if a charity is two lines
          //////////////////////////////////////////////////////////
          var charLength = $('.listCharity'+i)[0].innerText.length;
          if (charLength > 18) {
            $('.playButtonLL'+i).css({
              marginTop: '-15px'
            })
          }
        }
      }, 500)
      var charLength = $('.titleContCharity')[0].innerText.length;
      if (charLength > 18) {
        $('.playButtonH').css({
          marginTop: '-15px'
        })
      }
    }
    /////////////////////////////////////
    ////begin dividing controller by page, this will be simplified by the use of factories

    $('.donateNow').on('click', function(){
      var challenge = window.location.hash.split('/')[2]
      if(window.localStorage.sessionUser && window.localStorage.sessionUser != 'none'){
        window.location.hash = "#/donate/challengefriends/"+challenge
      } else {
        window.location.hash = "#/signin/donate/"+challenge
      }
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
        console.log(data);
        var allChallenges = data.data.reverse()
        console.log(allChallenges);
        self.specialChallenge = allChallenges[allChallenges.length-1]
        /////we'er adding an new attr to the object
        for (var i = 0; i < allChallenges.length; i++) {
          allChallenges[i].isPhoto = true;
          if(allChallenges[i].title.length < 20){
            allChallenges[i].title = allChallenges[i].title
          }
          if(allChallenges[i].charity[0].length < 19){
            allChallenges[i].charity[0] = allChallenges[i].charity[0]
          }
        }
        // allChallenges.pop()//////you can toggle the last challenge in and out using this function
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
          // console.log($('.listVid'+index)[0])
          // $('.listVid'+index)[0].addEventListener('onStateChange', function(){
          //   console.log('yo yoy oyoy o');
          // })
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
        console.log(heightswapRe
        );
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
          if(window.location.hash == "#/"){
            /////////begin if statement to deal with using this on single challenge, as well, and needing a different video
            //////////////////////////////
            $('.hVideo').append(
              "<iframe class='specialVid"+
              "'width='100%'"+ "height='"+height+"' src='"+url+"' frameborder='0'"+ "webkitallowfullscreen mozallowfullscreen"+ "allowfullscreen>"+
              "</iframe>"
            )
          } else {
            var singleUrl = self.singleChallenge.videoUrl+"?autoplay=1";
            $('.hVideo').append(
              "<iframe class='specialVid"+
              "'width='100%'"+ "height='"+height+"' src='"+singleUrl+"' frameborder='0'"+ "webkitallowfullscreen mozallowfullscreen"+ "allowfullscreen>"+
              "</iframe>"
            )
          }

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
        console.log('swapping');
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
            if(thisRespChall == thisChall+"-CHALLENGE" || thisRespChall == thisChall){
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

          $http({
            method: "GET"
            ,url: "/api/challenges/"+window.location.hash.split("/")[2]
          })
          .then(function(data){
            console.log(data)
            var charity = data.data.charity[0]
            $('.challengeContainer').append(
              "<div class='responseLightboxPaymentSuccess'>" +
                "<div class='responseLightboxText'>"+
                  "<p>Thank you for your donation to "+charity+". A Confirmation email will be sent to you shortly!</p>" +
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
          })
          // Thank you for making a donation to {{insert_charity_name}}. You will receive a follow up email with details for your records. Have a great one.

        }
      ///////////////////////////////////////////////////////////////
      ///////end payment received module/////////////////////////////

      ///////////////////////////////////////////////////////////////////////////////
      ////////////////Create a function to auto-adjust home page big window font-size
      function makeFit(){
        console.log('making fit');
        var windowSize = parseInt($(window).width())
        if(windowSize >= 1422){
          $('.titleSingle').css({
            fontSize: '51px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButtonList').css({
            width: "178px"
            ,height: "40px"
          })
          $('.acceptButton').css({
            width: '178px'
          })
          $('.acceptButton').css({
            height: '45px'
          })
          $('.hRemoveDescription').css({
            fontSize: '30px'
          })
          $('.listSectionRemove').css({
            fontSize: '24px'
          })
          $('.playButtonH').css({
            height: '100px'
          })
          $('.titleCont').css({
              fontSize: "84px"
            })
          $('.listContent').css({
              fontSize: "41px"
          })
        } else if(windowSize >= 1404){
          $('.titleSingle').css({
            fontSize: '50px'
          })
          $('.acceptButtonList').css({
            width: "176px"
            ,height: "40px"
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '177px'
          })
          $('.acceptButton').css({
            height: '45px'
          })
          $('.hRemoveDescription').css({
            fontSize: '30px'
          })
          $('.listSectionRemove').css({
            fontSize: '24px'
          })
          $('.playButtonH').css({
            height: '99px'
          })
          $('.titleCont').css({
              fontSize: "83px"
            })
          $('.listContent').css({
              fontSize: "40px"
          })
        } else if(windowSize >= 1387){
          $('.titleSingle').css({
            fontSize: '50px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '177px'
          })
          $('.acceptButton').css({
            height: '45px'
          })
          $('.acceptButtonList').css({
            width: "175px"
            ,height: "40px"
          })
          $('.hRemoveDescription').css({
            fontSize: '30px'
          })
          $('.listSectionRemove').css({
            fontSize: '24px'
          })
          $('.playButtonH').css({
            height: '98px'
          })
          $('.titleCont').css({
              fontSize: "82px"
            })
          $('.listContent').css({
            fontSize: '40px'
          })
        } else if(windowSize >= 1369){
          $('.titleSingle').css({
            fontSize: '49px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '176px'
          })
          $('.acceptButton').css({
            height: '44px'
          })
          $('.acceptButtonList').css({
            width: "174px"
            ,height: "40px"
          })
          $('.hRemoveDescription').css({
            fontSize: '30px'
          })
          $('.listSectionRemove').css({
            fontSize: '23px'
          })
          $('.playButtonH').css({
            height: '97px'
          })
          $('.titleCont').css({
              fontSize: "81px"
          })
          $('.listContent').css({
            fontSize: '39px'
          })
        } else if(windowSize >= 1351){
          $('.titleSingle').css({
            fontSize: '48px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '175px'
          })
          $('.acceptButton').css({
            height: '44px'
          })
          $('.acceptButtonList').css({
            width: "172px"
            ,height: "40px"
          })
          $('.hRemoveDescription').css({
            fontSize: '29px'
          })
          $('.listSectionRemove').css({
            fontSize: '23px'
          })
          $('.playButtonH').css({
            height: '96px'
          })
          $('.titleCont').css({
              fontSize: "80px"
            })
          $('.listContent').css({
            fontSize: '39px'
          })
        } else if(windowSize >= 1334){
          $('.titleSingle').css({
            fontSize: '48px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '175px'
          })
          $('.acceptButton').css({
            height: '44px'
          })
          $('.acceptButtonList').css({
            width: "171px"
            ,height: "40px"
          })
          $('.hRemoveDescription').css({
            fontSize: '29px'
          })
          $('.listSectionRemove').css({
            fontSize: '23px'
          })
          $('.playButtonH').css({
            height: '94px'
          })
          $('.titleCont').css({
              fontSize: "79px"
            })
          $('.listContent').css({
            fontSize: '38px'
          })
        } else if(windowSize >= 1317){
          $('.titleSingle').css({
            fontSize: '47px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '174px'
          })
          $('.acceptButton').css({
            height: '44px'
          })
          $('.acceptButtonList').css({
            width: "169px"
            ,height: "40px"
          })
          $('.hRemoveDescription').css({
            fontSize: '29px'
          })
          $('.listSectionRemove').css({
            fontSize: '23px'
          })
          $('.playButtonH').css({
            height: '93px'
          })
          $('.titleCont').css({
              fontSize: "78px"
            })
            $('.listContent').css({
              fontSize: '38px'
            })
        } else if(windowSize >= 1299){
          $('.titleSingle').css({
            fontSize: '47px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '174px'
          })
          $('.acceptButton').css({
            height: '43px'
          })
          $('.acceptButtonList').css({
            width: "168px"
            ,height: "40px"
          })
          $('.hRemoveDescription').css({
            fontSize: '29px'
          })
          $('.listSectionRemove').css({
            fontSize: '22px'
          })
          $('.playButtonH').css({
            height: '92px'
          })
          $('.titleCont').css({
              fontSize: "77px"
            })
          $('.listContent').css({
            fontSize: '37px'
          })
        } else if(windowSize >= 1281){
          $('.titleSingle').css({
            fontSize: '46px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '173px'
          })
          $('.acceptButton').css({
            height: '43px'
          })
          $('.acceptButtonList').css({
            width: "166px"
            ,height: "40px"
          })
          $('.hRemoveDescription').css({
            fontSize: '28px'
          })
          $('.listSectionRemove').css({
            fontSize: '22px'
          })
          $('.playButtonH').css({
            height: '91px'
          })
          $('.titleCont').css({
              fontSize: "76px"
            })
          $('.listContent').css({
            fontSize: '37px'
          })
        } else if(windowSize >= 1264){
          $('.titleSingle').css({
            fontSize: '45px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '172px'
          })
          $('.acceptButton').css({
            height: '43px'
          })
          $('.acceptButtonList').css({
            width: "165px"
            ,height: "40px"
          })
          $('.hRemoveDescription').css({
            fontSize: '28px'
          })
          $('.listSectionRemove').css({
            fontSize: '22px'
          })
          $('.playButtonH').css({
            height: '90px'
          })
          $('.titleCont').css({
              fontSize: "75px"
            })
          $('.listContent').css({
            fontSize: '36px'
          })
        } else if(windowSize >= 1246){
          $('.titleSingle').css({
            fontSize: '45px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '172px'
          })
          $('.acceptButton').css({
            height: '42px'
          })
          $('.acceptButtonList').css({
            width: "164px"
            ,height: "40px"
          })
          $('.hRemoveDescription').css({
            fontSize: '28px'
          })
          $('.listSectionRemove').css({
            fontSize: '22px'
          })
          $('.playButtonH').css({
            height: '89px'
          })
          $('.titleCont').css({
              fontSize: "74px"
            })
          $('.listContent').css({
            fontSize: '36px'
          })
        } else if(windowSize >= 1228){
          $('.titleSingle').css({
            fontSize: '44px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '171px'
          })
          $('.acceptButton').css({
            height: '42px'
          })
          $('.acceptButtonList').css({
            width: "162px"
            ,height: "40px"
          })
          $('.hRemoveDescription').css({
            fontSize: '27px'
          })
          $('.listSectionRemove').css({
            fontSize: '21px'
          })
          $('.playButtonH').css({
            height: '88px'
          })
          $('.titleCont').css({
              fontSize: "73px"
            })
          $('.listContent').css({
            fontSize: '35px'
          })
        } else if(windowSize >= 1211){
          $('.titleSingle').css({
            fontSize: '43px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '170px'
          })
          $('.acceptButton').css({
            height: '42px'
          })
          $('.acceptButtonList').css({
            width: "161px"
            ,height: "40px"
          })
          $('.hRemoveDescription').css({
            fontSize: '27px'
          })
          $('.listSectionRemove').css({
            fontSize: '21px'
          })
          $('.playButtonH').css({
            height: '87px'
          })
          $('.titleCont').css({
              fontSize: "72px"
            })
          $('.listContent').css({
            fontSize: '34px'
          })
        } else if(windowSize >= 1193){
          $('.titleSingle').css({
            fontSize: '43px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '170px'
          })
          $('.acceptButton').css({
            height: '42px'
          })
          $('.acceptButtonList').css({
            width: "159px"
            ,height: "40px"
          })
          $('.hRemoveDescription').css({
            fontSize: '27px'
          })
          $('.listSectionRemove').css({
            fontSize: '21px'
          })
          $('.playButtonH').css({
            height: '86px'
          })
          $('.titleCont').css({
              fontSize: "71px"
            })
          $('.listContent').css({
            fontSize: '34px'
          })
        } else if(windowSize >= 1175){
          $('.titleSingle').css({
            fontSize: '42px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '169px'
          })
          $('.acceptButton').css({
            height: '42px'
          })
          $('.acceptButtonList').css({
            width: "159px"
            ,height: "40px"
          })
          $('.hRemoveDescription').css({
            fontSize: '27px'
          })
          $('.listSectionRemove').css({
            fontSize: '20px'
          })
          $('.playButtonH').css({
            height: '85px'
          })
          $('.titleCont').css({
              fontSize: "70px"
            })
          $('.listContent').css({
            fontSize: '33px'
          })
        } else if(windowSize >= 1158){
          $('.titleSingle').css({
            fontSize: '41px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '168px'
          })
          $('.acceptButton').css({
            height: '41px'
          })
          $('.acceptButtonList').css({
            width: "156px"
            ,height: "40px"
          })
          $('.hRemoveDescription').css({
            fontSize: '26px'
          })
          $('.listSectionRemove').css({
            fontSize: '20px'
          })
          $('.playButtonH').css({
            height: '84px'
          })
          $('.titleCont').css({
              fontSize: "69px"
            })
          $('.listContent').css({
            fontSize: '33px'
          })
        } else if(windowSize >= 1140){
          $('.titleSingle').css({
            fontSize: '41px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '168px'
          })
          $('.acceptButton').css({
            height: '41px'
          })
          $('.acceptButtonList').css({
            width: "154px"
            ,height: "40px"
          })
          $('.hRemoveDescription').css({
            fontSize: '26px'
          })
          $('.listSectionRemove').css({
            fontSize: '20px'
          })
          $('.playButtonH').css({
            height: '83px'
          })
          $('.titleCont').css({
              fontSize: "68px"
            })
          $('.listContent').css({
            fontSize: '32px'
          })
        } else if(windowSize >= 1123){
          $('.titleSingle').css({
            fontSize: '40px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '167px'
          })
          $('.acceptButton').css({
            height: '40px'
          })
          $('.acceptButtonList').css({
            width: "153px"
            ,height: "40px"
          })
          $('.hRemoveDescription').css({
            fontSize: '26px'
          })
          $('.listSectionRemove').css({
            fontSize: '20px'
          })
          $('.playButtonH').css({
            height: '82px'
          })
          $('.titleCont').css({
              fontSize: "67px"
            })
          $('.listContent').css({
            fontSize: '32px'
          })
        } else if(windowSize >= 1105){
          $('.titleSingle').css({
            fontSize: '40px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '166px'
          })
          $('.acceptButton').css({
            height: '40px'
          })
          $('.acceptButtonList').css({
            width: "151px"
            ,height: "40px"
          })
          $('.hRemoveDescription').css({
            fontSize: '26px'
          })
          $('.listSectionRemove').css({
            fontSize: '19px'
          })
          $('.playButtonH').css({
            height: '81px'
          })
          $('.titleCont').css({
              fontSize: "66px"
            })
            $('.listContent').css({
              fontSize: '31px'
            })
        } else if(windowSize >= 1087){
          $('.titleSingle').css({
            fontSize: '39px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '166px'
          })
          $('.acceptButton').css({
            height: '40px'
          })
          $('.acceptButtonList').css({
            width: "150px"
            ,height: "40px"
          })
          $('.hRemoveDescription').css({
            fontSize: '26px'
          })
          $('.listSectionRemove').css({
            fontSize: '19px'
          })
          $('.playButtonH').css({
            height: '79px'
          })
          $('.titleCont').css({
              fontSize: "65px"
            })
          $('.listContent').css({
            fontSize: '31px'
          })
        } else if(windowSize >= 1069){
          $('.titleSingle').css({
            fontSize: '38px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '165px'
          })
          $('.acceptButton').css({
            height: '40px'
          })
          $('.acceptButtonList').css({
            width: "148px"
            ,height: "40px"
          })
          $('.hRemoveDescription').css({
            fontSize: '25px'
          })
          $('.listSectionRemove').css({
            fontSize: '19px'
          })
          $('.playButtonH').css({
            height: '78px'
          })
          $('.titleCont').css({
              fontSize: "64px"
            })
            $('.listContent').css({
              fontSize: '30px'
            })
        } else if(windowSize >= 1052){
          $('.titleSingle').css({
            fontSize: '37px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '164px'
          })
          $('.acceptButton').css({
            height: '39px'
          })
          $('.hRemoveDescription').css({
            fontSize: '25px'
          })
          $('.listSectionRemove').css({
            fontSize: '19px'
          })
          $('.playButtonH').css({
            height: '77px'
          })
          $('.titleCont').css({
              fontSize: "63px"
            })
          $('.listContent').css({
            fontSize: '30px'
          })
        } else if(windowSize >= 1035){
          $('.titleSingle').css({
            fontSize: '37px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '164px'
          })
          $('.acceptButton').css({
            height: '39px'
          })
          $('.hRemoveDescription').css({
            fontSize: '25px'
          })
          $('.listSectionRemove').css({
            fontSize: '18px'
          })
          $('.playButtonH').css({
            height: '76px'
          })
          $('.titleCont').css({
              fontSize: "62px"
            })
          $('.listContent').css({
            fontSize: '29px'
          })
        } else if(windowSize >= 1017){
          $('.titleSingle').css({
            fontSize: '36px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '163px'
          })
          $('.acceptButton').css({
            height: '39px'
          })
          $('.hRemoveDescription').css({
            fontSize: '24px'
          })
          $('.listSectionRemove').css({
            fontSize: '18px'
          })
          $('.playButtonH').css({
            height: '75px'
          })
          $('.titleCont').css({
              fontSize: "61px"
            })
          $('.listContent').css({
            fontSize: '29px'
          })
        } else if(windowSize >= 999){
          $('.titleSingle').css({
            fontSize: '35px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '162px'
          })
          $('.acceptButton').css({
            height: '38px'
          })
          $('.hRemoveDescription').css({
            fontSize: '24px'
          })
          $('.listSectionRemove').css({
            fontSize: '18px'
          })
          $('.listSectionRemove').css({
            fontSize: '18px'
          })
          $('.playButtonH').css({
            height: '74px'
          })
          $('.titleCont').css({
              fontSize: "60px"
            })
          $('.listContent').css({
            fontSize: '28px'
          })
        } else if(windowSize >= 992){
          $('.titleSingle').css({
            fontSize: '35px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '162px'
          })
          $('.acceptButton').css({
            height: '38px'
          })
          $('.acceptButtonList').css({
            width: "143px"
            ,height: "29px"
          })
          $('.hRemoveDescription').css({
            fontSize: '24px'
          })
          $('.listSectionRemove').css({
            fontSize: '18px'
          })
          $('.listSectionRemove').css({
            fontSize: '24px'
          })
          $('.playButtonH').css({
            height: '73px'
          })
          $('.titleCont').css({
              fontSize: "59px"
            })
          $('.listContent').css({
              fontSize: "28px"
            })
        } else if(windowSize >= 982){
          $('.titleSingle').css({
            fontSize: '59px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '162px'
          })
          $('.acceptButton').css({
            height: '38px'
          })
          $('.acceptButtonList').css({
            width: '162px'
          })
          $('.acceptButtonList').css({
            height: '38px'
          })
          $('.hRemoveDescription').css({
            fontSize: '24px'
          })
          $('.listSectionRemove').css({
            fontSize: '24px'
          })
          $('.playButtonH').css({
            height: '73px'
          })
          $('.titleCont').css({
              fontSize: "59px"
            })
          $('.listContent').css({
            fontSize: '59px'
          })
        } else if(windowSize >= 964){
          $('.titleSingle').css({
            fontSize: '58px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '161px'
          })
          $('.acceptButton').css({
            height: '38px'
          })
          $('.acceptButtonList').css({
            width: '161px'
          })
          $('.acceptButtonList').css({
            height: '38px'
          })
          $('.hRemoveDescription').css({
            fontSize: '24px'
          })
          $('.listSectionRemove').css({
            fontSize: '24px'
          })
          $('.playButtonH').css({
            height: '72px'
          })
          $('.titleCont').css({
              fontSize: "58px"
            })
          $('.listContent').css({
            fontSize: '58px'
          })
        } else if(windowSize >= 946){
          $('.titleSingle').css({
            fontSize: '57px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '161px'
          })
          $('.acceptButton').css({
            height: '38px'
          })
          $('.acceptButtonList').css({
            width: '161px'
          })
          $('.acceptButtonList').css({
            height: '38px'
          })
          $('.hRemoveDescription').css({
            fontSize: '23px'
          })
          $('.listSectionRemove').css({
            fontSize: '23px'
          })
          $('.playButtonH').css({
            height: '71px'
          })
          $('.titleCont').css({
              fontSize: "57px"
            })
          $('.listContent').css({
            fontSize: '57px'
          })
        } else if(windowSize >= 929){
          $('.titleSingle').css({
            fontSize: '56px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '160px'
          })
          $('.acceptButton').css({
            height: '37px'
          })
          $('.acceptButtonList').css({
            width: '160px'
          })
          $('.acceptButtonList').css({
            height: '37px'
          })
          $('.hRemoveDescription').css({
            fontSize: '23px'
          })
          $('.listSectionRemove').css({
            fontSize: '23px'
          })
          $('.playButtonH').css({
            height: '70px'
          })
          $('.titleCont').css({
              fontSize: "56px"
            })
          $('.listContent').css({
            fontSize: '56px'
          })
        } else if(windowSize >= 911){
          $('.titleSingle').css({
            fontSize: '55px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '159px'
          })
          $('.acceptButton').css({
            height: '37px'
          })
          $('.acceptButtonList').css({
            width: '159px'
          })
          $('.acceptButtonList').css({
            height: '37px'
          })
          $('.hRemoveDescription').css({
            fontSize: '23px'
          })
          $('.listSectionRemove').css({
            fontSize: '23px'
          })
          $('.playButtonH').css({
            height: '69px'
          })
          $('.titleCont').css({
              fontSize: "55px"
            })
          $('.listContent').css({
            fontSize: '55px'
          })
        } else if(windowSize >= 894){
          $('.titleSingle').css({
            fontSize: '54px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '159px'
          })
          $('.acceptButton').css({
            height: '37px'
          })
          $('.acceptButtonList').css({
            width: '159px'
          })
          $('.acceptButtonList').css({
            height: '37px'
          })
          $('.hRemoveDescription').css({
            fontSize: '23px'
          })
          $('.listSectionRemove').css({
            fontSize: '23px'
          })
          $('.playButtonH').css({
            height: '68px'
          })
          $('.titleCont').css({
              fontSize: "54px"
            })
          $('.listContent').css({
            fontSize: '54px'
          })
        } else if(windowSize >= 876){
          $('.titleSingle').css({
            fontSize: '53px'
          })
          $('.acceptButton').css({
            marginTop: '10px'
          })
          $('.acceptButton').css({
            width: '158px'
          })
          $('.acceptButton').css({
            height: '36px'
          })
          $('.acceptButtonList').css({
            width: '158px'
          })
          $('.acceptButtonList').css({
            height: '36px'
          })
          $('.hRemoveDescription').css({
            fontSize: '22px'
          })
          $('.listSectionRemove').css({
            fontSize: '22px'
          })
          $('.playButtonH').css({
            height: '67px'
          })
          $('.titleCont').css({
              fontSize: "53px"
            })
          $('.listContent').css({
            fontSize: '53px'
          })
        } else if(windowSize >= 858){
          $('.titleSingle').css({
            fontSize: '52px'
          })
          $('.acceptButton').css({
            marginTop: '0px'
          })
          $('.acceptButton').css({
            width: '157px'
          })
          $('.acceptButton').css({
            height: '36px'
          })
          $('.acceptButtonList').css({
            width: '157px'
          })
          $('.acceptButtonList').css({
            height: '36px'
          })
          $('.hRemoveDescription').css({
            fontSize: '22px'
          })
          $('.listSectionRemove').css({
            fontSize: '22px'
          })
          $('.playButtonH').css({
            height: '66px'
          })
          $('.titleCont').css({
              fontSize: "52px"
            })
          $('.listContent').css({
            fontSize: '52px'
          })
        } else if(windowSize >= 841){
          $('.titleSingle').css({
            fontSize: '51px'
          })
          $('.acceptButton').css({
            marginTop: '0px'
          })
          $('.acceptButton').css({
            width: '157px'
          })
          $('.acceptButton').css({
            height: '36px'
          })
          $('.acceptButtonList').css({
            width: '157px'
          })
          $('.acceptButtonList').css({
            height: '36px'
          })
          $('.hRemoveDescription').css({
            fontSize: '22px'
          })
          $('.listSectionRemove').css({
            fontSize: '22px'
          })
          $('.playButtonH').css({
            height: '65px'
          })
          $('.titleCont').css({
              fontSize: "51px"
            })
          $('.listContent').css({
            fontSize: '51px'
          })
        } else if(windowSize >= 823){
          $('.titleSingle').css({
            fontSize: '50px'
          })
          $('.acceptButton').css({
            marginTop: '0px'
          })
          $('.acceptButton').css({
            width: '156px'
          })
          $('.acceptButton').css({
            height: '35px'
          })
          $('.acceptButtonList').css({
            width: '156px'
          })
          $('.acceptButtonList').css({
            height: '35px'
          })
          $('.hRemoveDescription').css({
            fontSize: '22px'
          })
          $('.listSectionRemove').css({
            fontSize: '22px'
          })
          $('.playButtonH').css({
            height: '64px'
          })
          $('.titleCont').css({
              fontSize: "50px"
            })
          $('.listContent').css({
            fontSize: '50px'
          })
        } else if(windowSize >= 805){
          $('.titleSingle').css({
            fontSize: '49px'
          })
          $('.acceptButton').css({
            marginTop: '0px'
          })
          $('.acceptButton').css({
            width: '155px'
          })
          $('.acceptButton').css({
            height: '35px'
          })
          $('.acceptButtonList').css({
            width: '155px'
          })
          $('.acceptButtonList').css({
            height: '35px'
          })
          $('.hRemoveDescription').css({
            fontSize: '21px'
          })
          $('.listSectionRemove').css({
            fontSize: '21px'
          })
          $('.playButtonH').css({
            height: '63px'
          })
          $('.titleCont').css({
              fontSize: "49px"
            })
          $('.listContent').css({
            fontSize: '49px'
          })
        } else if(windowSize >= 788){
          $('.titleSingle').css({
            fontSize: '48px'
          })
          $('.acceptButton').css({
            marginTop: '0px'
          })
          $('.acceptButton').css({
            width: '155px'
          })
          $('.acceptButton').css({
            height: '35px'
          })
          $('.acceptButtonList').css({
            width: '155px'
          })
          $('.acceptButtonList').css({
            height: '35px'
          })
          $('.hRemoveDescription').css({
            fontSize: '21px'
          })
          $('.listSectionRemove').css({
            fontSize: '21px'
          })
          $('.playButtonH').css({
            height: '62px'
          })
          $('.titleCont').css({
              fontSize: "48px"
            })
          $('.listContent').css({
            fontSize: '48px'
          })
        } else if(windowSize >= 770){
          $('.titleSingle').css({
            fontSize: '47px'
          })
          $('.acceptButton').css({
            marginTop: '0px'
          })
          $('.acceptButton').css({
            width: '154px'
          })
          $('.acceptButton').css({
            height: '35px'
          })
          $('.acceptButtonList').css({
            width: '154px'
          })
          $('.acceptButtonList').css({
            height: '35px'
          })
          $('.hRemoveDescription').css({
            fontSize: '21px'
          })
          $('.listSectionRemove').css({
            fontSize: '21px'
          })
          $('.listSectionRemove').css({
            fontSize: '22px'
          })
          $('.playButtonH').css({
            height: '61px'
          })
          $('.titleCont').css({
              fontSize: "47px"
            })
          $('.listContent').css({
              fontSize: "47px"
            })
        } else if(windowSize >= 753){
          $('.titleSingle').css({
            fontSize: '46px'
          })
          $('.acceptButton').css({
            marginTop: '0px'
          })
          $('.acceptButton').css({
            width: '154px'
          })
          $('.acceptButton').css({
            height: '34px'
          })
          $('.acceptButtonList').css({
            width: '154px'
          })
          $('.acceptButtonList').css({
            height: '34px'
          })
          $('.hRemoveDescription').css({
            fontSize: '21px'
          })
          $('.listSectionRemove').css({
            fontSize: '21px'
          })
          $('.playButtonH').css({
            height: '60px'
          })
          $('.titleCont').css({
              fontSize: "46px"
            })
          $('.listContent').css({
              fontSize: "46px"
            })
        } else if(windowSize >= 735){
          $('.titleSingle').css({
            fontSize: '45px'
          })
          $('.acceptButton').css({
            marginTop: '0px'
          })
          $('.acceptButton').css({
            width: '153px'
          })
          $('.acceptButton').css({
            height: '34px'
          })
          $('.acceptButtonList').css({
            width: '153px'
          })
          $('.acceptButtonList').css({
            height: '34px'
          })
          $('.hRemoveDescription').css({
            fontSize: '20px'
          })
          $('.listSectionRemove').css({
            fontSize: '20px'
          })
          $('.playButtonH').css({
            height: '59px'
          })
          $('.titleCont').css({
              fontSize: "45px"
            })
          $('.listContent').css({
              fontSize: "45px"
            })
        } else if(windowSize >= 717){
          $('.titleSingle').css({
            fontSize: '44px'
          })
          $('.acceptButton').css({
            marginTop: '0px'
          })
          $('.acceptButton').css({
            width: '152px'
          })
          $('.acceptButton').css({
            height: '34px'
          })
          $('.acceptButtonList').css({
            width: '152px'
          })
          $('.acceptButtonList').css({
            height: '34px'
          })
          $('.hRemoveDescription').css({
            fontSize: '20px'
          })
          $('.listSectionRemove').css({
            fontSize: '20px'
          })
          $('.playButtonH').css({
            height: '58px'
          })
          $('.titleCont').css({
              fontSize: "44px"
            })
          $('.listContent').css({
              fontSize: "44px"
            })
        } else if(windowSize >= 700){
          $('.titleSingle').css({
            fontSize: '43px'
          })
          $('.acceptButton').css({
            marginTop: '0px'
          })
          $('.acceptButton').css({
            width: '152px'
          })
          $('.acceptButton').css({
            height: '34px'
          })
          $('.acceptButtonList').css({
            width: '152px'
          })
          $('.acceptButtonList').css({
            height: '34px'
          })
          $('.hRemoveDescription').css({
            fontSize: '20px'
          })
          $('.listSectionRemove').css({
            fontSize: '20px'
          })
          $('.playButtonH').css({
            height: '57px'
          })
          $('.titleCont').css({
              fontSize: "43px"
            })
          $('.listContent').css({
              fontSize: "43px"
            })
        } else if(windowSize >= 682){
          $('.titleSingle').css({
            fontSize: '42px'
          })
          $('.acceptButton').css({
            marginTop: '0px'
          })
          $('.acceptButton').css({
            width: '151px'
          })
          $('.acceptButton').css({
            height: '33px'
          })
          $('.acceptButtonList').css({
            width: '151px'
          })
          $('.acceptButtonList').css({
            height: '33px'
          })
          $('.hRemoveDescription').css({
            fontSize: '20px'
          })
          $('.listSectionRemove').css({
            fontSize: '20px'
          })
          $('.playButtonH').css({
            height: '56px'
          })
          $('.titleCont').css({
              fontSize: "42px"
            })
          $('.listContent').css({
              fontSize: "42px"
            })
        } else if(windowSize >= 664){
          $('.titleSingle').css({
            fontSize: '41px'
          })
          $('.acceptButton').css({
            marginTop: '0px'
          })
          $('.acceptButton').css({
            width: '150px'
          })
          $('.acceptButton').css({
            height: '33px'
          })
          $('.acceptButtonList').css({
            width: '150px'
          })
          $('.acceptButtonList').css({
            height: '33px'
          })
          $('.hRemoveDescription').css({
            fontSize: '19px'
          })
          $('.listSectionRemove').css({
            fontSize: '19px'
          })
          $('.playButtonH').css({
            height: '55px'
          })
          $('.titleCont').css({
              fontSize: "41px"
            })
          $('.listContent').css({
              fontSize: "41px"
            })
        } else if(windowSize >= 647){
          $('.titleSingle').css({
            fontSize: '40px'
          })
          $('.acceptButton').css({
            marginTop: '0px'
          })
          $('.acceptButton').css({
            width: '150px'
          })
          $('.acceptButton').css({
            height: '33px'
          })
          $('.acceptButtonList').css({
            width: '150px'
          })
          $('.acceptButtonList').css({
            height: '33px'
          })
          $('.hRemoveDescription').css({
            fontSize: '19px'
          })
          $('.listSectionRemove').css({
            fontSize: '19px'
          })
          $('.playButtonH').css({
            height: '54px'
          })
          $('.titleCont').css({
              fontSize: "40px"
            })
          $('.listContent').css({
              fontSize: "40px"
            })
        } else if(windowSize >= 629){
          $('.titleSingle').css({
            fontSize: '39px'
          })
          $('.acceptButton').css({
            marginTop: '0px'
          })
          $('.acceptButton').css({
            width: '149px'
          })
          $('.acceptButton').css({
            height: '32px'
          })
          $('.acceptButtonList').css({
            width: '149px'
          })
          $('.acceptButtonList').css({
            height: '32px'
          })
          $('.hRemoveDescription').css({
            fontSize: '19px'
          })
          $('.listSectionRemove').css({
            fontSize: '19px'
          })
          $('.playButtonH').css({
            height: '53px'
          })
          $('.titleCont').css({
              fontSize: "39px"
            })
          $('.listContent').css({
              fontSize: "39px"
            })
        } else if(windowSize >= 611){
          $('.titleSingle').css({
            fontSize: '38px'
          })
          $('.acceptButton').css({
            marginTop: '0px'
          })
          $('.acceptButton').css({
            width: '148px'
          })
          $('.acceptButton').css({
            height: '32px'
          })
          $('.acceptButtonList').css({
            width: '148px'
          })
          $('.acceptButtonList').css({
            height: '32px'
          })
          $('.hRemoveDescription').css({
            fontSize: '19px'
          })
          $('.listSectionRemove').css({
            fontSize: '19px'
          })
          $('.playButtonH').css({
            height: '52px'
          })
          $('.titleCont').css({
              fontSize: "38px"
            })
          $('.listContent').css({
              fontSize: "38px"
            })
        } else if(windowSize >= 594){
          $('.titleSingle').css({
            fontSize: '37px'
          })
          $('.acceptButton').css({
            marginTop: '0px'
          })
          $('.acceptButton').css({
            width: '148px'
          })
          $('.acceptButton').css({
            height: '32px'
          })
          $('.acceptButtonList').css({
            width: '148px'
          })
          $('.acceptButtonList').css({
            height: '32px'
          })
          $('.hRemoveDescription').css({
            fontSize: '18px'
          })
          $('.listSectionRemove').css({
            fontSize: '18px'
          })
          $('.playButtonH').css({
            height: '51px'
          })
          $('.titleCont').css({
              fontSize: "37px"
            })
          $('.listContent').css({
              fontSize: "37px"
            })
        } else if(windowSize >= 576){
          $('.titleSingle').css({
            fontSize: '35px'
          })
          $('.acceptButton').css({
            marginTop: '0px'
          })
          $('.acceptButton').css({
            width: '147px'
          })
          $('.acceptButton').css({
            height: '31px'
          })
          $('.acceptButtonList').css({
            width: '147px'
          })
          $('.acceptButtonList').css({
            height: '31px'
          })
          $('.hRemoveDescription').css({
            fontSize: '18px'
          })
          $('.listSectionRemove').css({
            fontSize: '18px'
          })
          $('.playButtonH').css({
            height: '50px'
          })
          $('.titleCont').css({
              fontSize: "35px"
            })
          $('.listContent').css({
              fontSize: "35px"
            })
        } else if(windowSize >= 559){
          $('.titleSingle').css({
            fontSize: '34px'
          })
          $('.acceptButton').css({
            marginTop: '0px'
          })
          $('.acceptButton').css({
            width: '147px'
          })
          $('.acceptButton').css({
            height: '31px'
          })
          $('.acceptButtonList').css({
            width: '147px'
          })
          $('.acceptButtonList').css({
            height: '31px'
          })
          $('.hRemoveDescription').css({
            fontSize: '18px'
          })
          $('.listSectionRemove').css({
            fontSize: '18px'
          })
          $('.playButtonH').css({
            height: '49px'
          })
          $('.titleCont').css({
              fontSize: "34px"
            })
          $('.listContent').css({
              fontSize: "34px"
            })
        } else if(windowSize >= 541){
          $('.titleSingle').css({
            fontSize: '33px'
          })
          $('.acceptButton').css({
            marginTop: '0px'
          })
          $('.acceptButton').css({
            width: '146px'
          })
          $('.acceptButton').css({
            height: '31px'
          })
          $('.acceptButtonList').css({
            width: '146px'
          })
          $('.acceptButtonList').css({
            height: '31px'
          })
          $('.hRemoveDescription').css({
            fontSize: '18px'
          })
          $('.listSectionRemove').css({
            fontSize: '18px'
          })
          $('.playButtonH').css({
            height: '48px'
          })
          $('.titleCont').css({
              fontSize: "33px"
            })
          $('.listContent').css({
              fontSize: "33px"
            })
        } else if(windowSize >= 523){
          $('.titleSingle').css({
            fontSize: '32px'
          })
          $('.acceptButton').css({
            marginTop: '0px'
          })
          $('.acceptButton').css({
            width: '145px'
          })
          $('.acceptButton').css({
            height: '31px'
          })
          $('.acceptButtonList').css({
            width: '145px'
          })
          $('.acceptButtonList').css({
            height: '31px'
          })
          $('.hRemoveDescription').css({
            fontSize: '17px'
          })
          $('.listSectionRemove').css({
            fontSize: '17px'
          })
          $('.playButtonH').css({
            height: '47px'
          })
          $('.titleCont').css({
              fontSize: "32px"
            })
          $('.listContent').css({
              fontSize: "32px"
            })
        } else if(windowSize >= 506){
          $('.titleSingle').css({
            fontSize: '31px'
          })
          $('.acceptButton').css({
            marginTop: '0px'
          })
          $('.acceptButton').css({
            width: '145px'
          })
          $('.acceptButton').css({
            height: '30px'
          })
          $('.acceptButtonList').css({
            width: '145px'
          })
          $('.acceptButtonList').css({
            height: '30px'
          })
          $('.hRemoveDescription').css({
            fontSize: '17px'
          })
          $('.listSectionRemove').css({
            fontSize: '17px'
          })
          $('.playButtonH').css({
            height: '46px'
          })
          $('.titleCont').css({
              fontSize: "31px"
            })
          $('.listContent').css({
              fontSize: "31px"
            })
        } else if(windowSize >= 488){
          $('.titleSingle').css({
            fontSize: '30px'
          })
          $('.acceptButton').css({
            marginTop: '0px'
          })
          $('.acceptButton').css({
            width: '144px'
          })
          $('.acceptButton').css({
            height: '30px'
          })
          $('.acceptButtonList').css({
            width: '144px'
          })
          $('.acceptButtonList').css({
            height: '30px'
          })
          $('.hRemoveDescription').css({
            fontSize: '17px'
          })
          $('.listSectionRemove').css({
            fontSize: '17px'
          })
          $('.playButtonH').css({
            height: '45px'
          })
          $('.titleCont').css({
              fontSize: "30px"
            })
          $('.listContent').css({
              fontSize: "30px"
            })
        } else if(windowSize >= 471){
          $('.titleSingle').css({
            fontSize: '29px'
          })
          $('.acceptButton').css({
            marginTop: '0px'
          })
          $('.acceptButton').css({
            width: '143px'
          })
          $('.acceptButton').css({
            height: '30px'
          })
          $('.acceptButtonList').css({
            width: '143px'
          })
          $('.acceptButtonList').css({
            height: '30px'
          })
          $('.hRemoveDescription').css({
            fontSize: '17px'
          })
          $('.listSectionRemove').css({
            fontSize: '17px'
          })
          $('.playButtonH').css({
            height: '44px'
          })
          $('.titleCont').css({
              fontSize: "29px"
            })
          $('.listContent').css({
              fontSize: "29px"
            })
        } else if(windowSize >= 452){
          $('.titleSingle').css({
            fontSize: '28px'
          })
          $('.acceptButton').css({
            marginTop: '0px'
          })
          $('.acceptButton').css({
            width: '143px'
          })
          $('.acceptButton').css({
            height: '29px'
          })
          $('.acceptButtonList').css({
            width: '143px'
          })
          $('.acceptButtonList').css({
            height: '29px'
          })
          $('.hRemoveDescription').css({
            fontSize: '16px'
          })
          $('.listSectionRemove').css({
            fontSize: '16px'
          })
          $('.playButtonH').css({
            height: '43px'
          })
          $('.titleCont').css({
              fontSize: "28px"
            })
          $('.listContent').css({
              fontSize: "28px"
            })
        } else if(windowSize >= 435){
          $('.titleSingle').css({
            fontSize: '27px'
          })
          $('.acceptButton').css({
            marginTop: '0px'
          })
          $('.acceptButton').css({
            width: '142px'
          })
          $('.acceptButton').css({
            height: '29px'
          })
          $('.acceptButtonList').css({
            width: '142px'
          })
          $('.acceptButtonList').css({
            height: '29px'
          })
          $('.hRemoveDescription').css({
            fontSize: '16px'
          })
          $('.listSectionRemove').css({
            fontSize: '16px'
          })
          $('.playButtonH').css({
            height: '42px'
          })
          $('.titleCont').css({
              fontSize: "27px"
            })
          $('.listContent').css({
              fontSize: "27px"
            })
        } else if(windowSize >= 418){
          $('.titleSingle').css({
            fontSize: '26px'
          })
          $('.acceptButton').css({
            marginTop: '0px'
          })
          $('.acceptButton').css({
            width: '141px'
          })
          $('.acceptButton').css({
            height: '29px'
          })
          $('.acceptButtonList').css({
            width: '141px'
          })
          $('.acceptButtonList').css({
            height: '29px'
          })
          $('.hRemoveDescription').css({
            fontSize: '16px'
          })
          $('.listSectionRemove').css({
            fontSize: '16px'
          })
          $('.playButtonH').css({
            height: '41px'
          })
          $('.titleCont').css({
              fontSize: "26px"
            })
          $('.listContent').css({
              fontSize: "26px"
            })
        } else if(windowSize >= 400){
          $('.titleSingle').css({
            fontSize: '25px'
          })
          $('.acceptButton').css({
            marginTop: '0px'
          })
          $('.acceptButton').css({
            width: '140px'
          })
          $('.acceptButton').css({
            height: '29px'
          })
          $('.acceptButtonList').css({
            width: '140px'
          })
          $('.acceptButtonList').css({
            height: '29px'
          })
          $('.hRemoveDescription').css({
            fontSize: '16px'
          })
          $('.listSectionRemove').css({
            fontSize: '16px'
          })
          $('.playButtonH').css({
            height: '40px'
          })
          $('.titleCont').css({
              fontSize: "25px"
            })
          $('.listContent').css({
              fontSize: "25px"
            })
        }
      }
      $(window).resize(function(){
        makeFit()
      })
      setTimeout(function(){
        makeFit()
      }, 800)

      ///////////////////end creating font-adjusting function
      ///////////////////////////////////////////////////////

    ////////////////////end of the controller
    }
