angular.module('mainController', [])

  .controller('mainCtrl', mainCtrl);

  function mainCtrl($http){
    var self = this;

    self.firstData = "hi there everyone";

  }
