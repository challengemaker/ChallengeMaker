angular.module('userController', [])

  .controller('userCtrl', userCtrl)

    function userCtrl($http){
      var self = this;

      self.someUser = "Samuel L. Jackson";
    }
