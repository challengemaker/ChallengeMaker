angular.module('challengesController', [])

  .controller('challengesCtrl', challengesCtrl)

  function challengesCtrl($http){
    var self = this;

    self.upDog = "What's up dog?"
  }
