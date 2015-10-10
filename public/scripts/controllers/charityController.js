angular.module('charityController', [])

  .controller('charityCtrl', charityCtrl)

  function charityCtrl($http){
    var self = this;

    self.charity = "The Girl Scouts"
  }
