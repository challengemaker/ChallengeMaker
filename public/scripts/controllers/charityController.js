angular.module('charityController', [])

  .controller('charityCtrl', charityCtrl)

  function charityCtrl($http){
    var self = this;

    self.charity = "The Girl Scouts";

    $http.get('/api/charities')
      .then(function(data){
        console.log(data);
      })
  }
