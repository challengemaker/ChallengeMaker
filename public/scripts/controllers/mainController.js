angular.module('mainController', [])

  .controller('mainCtrl', mainCtrl);

  function mainCtrl($http, $location){
    var self = this;

    self.firstData = "hi there everyone"

  }
