angular.module('charityController', [])

  .controller('charityCtrl', charityCtrl)

  challengesCtrl.$inject = ['$http'];
  function charityCtrl($http){
    var self = this;

    if(window.location.hash == "#/charities"){
      console.log('yo');
      $http.get('/api/charities')
        .then(function(data){
          console.log(data);
          self.charities = data.data;
        })
    } else {
      var charityNameHash = window.location.hash.split('/');
      var charityName = charityNameHash[charityNameHash.length - 1];
      $http.get("/api/charities/Unicef")
        .then(function(data){
          console.log(data);
          self.singleCharity = data.data;
        })

    }

  }
