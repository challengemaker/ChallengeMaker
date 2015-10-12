angular.module('responseController', [])

  .controller('responseCtrl', responseCtrl);

  responseCtrl.$inject = ['$http'];
  function responseCtrl($http){
    var self = this;
    ////create submit-new-response section
    //////////////////////////////////////
    $('#submitResponse').on('click', function(){
      var title = $('#responseTitle').val();
      var description = $('#responseDescription').val();
      var video = $('#responseVid').val();
      $http({
        method: "POST",
        url: "api/responses",
        data: {title: title, description: description, video_url: video},
        success: function(){
          console.log('I think it worked');
        }
      })
    })
    ////////////////////////////
    ///end creating new response

    ////show all responses on /responses
    if(window.location.hash == "#/responses"){
      $http({
        url: '/api/responses',
        method: 'GET'
      })
        .then(function(data){
          self.allResponses = data.data;
          console.log(data.data);
        })
    }
    //////end showing all responses
    ///////////////////////////////

    /////begin getting all charities (will be a factory)
    var hash = window.location.hash.split('/');
    console.log(hash[1]);
    console.log(hash[2]);
    if(hash[1] == "newresponse" && hash[2]){
      console.log('yo yo');
    }
    ///end getting all charities


  }
